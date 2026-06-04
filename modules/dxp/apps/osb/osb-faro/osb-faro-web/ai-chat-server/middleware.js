/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const {ALLOWED_TOOLS, evaluateToolCall} = require('./readOnlyGuard');
const {CHART_TYPES, validateChartSpec} = require('./chartSpec');
const {
	missingKeyError,
	resolveApiKey,
	resolveModel
} = require('./resolveConfig');

const CHART_SERVER = 'faro_chart';
const CHART_TOOL = `mcp__${CHART_SERVER}__render_chart`;
const MCP_SERVER = 'liferay-ac-stg';

// Endpoint discovery over a large API surface can need several turns; a low cap
// makes the agent stop without an answer. Override with AC_CHAT_MAX_TURNS.
const MAX_TURNS = Number(process.env.AC_CHAT_MAX_TURNS) || 20;

const PATH = '/ai-chat';
const VALIDATE_PATH = '/ai-chat/validate';

// Resolves the Analytics Cloud MCP server config. The Authorization header
// comes from the request (the settings page); env vars are not consulted.
function resolveMcpServer(requestAuth) {
	const base = (
		process.env.FARO_URL || 'https://analytics-stg.liferay.com'
	).replace(/\/$/, '');

	const headers = {};

	if (requestAuth) {
		headers.Authorization = requestAuth;
	}

	// alwaysLoad: with built-in tools disabled there is no tool search, so the
	// MCP tools must be loaded straight into the prompt instead of deferred.
	return {alwaysLoad: true, headers, type: 'http', url: `${base}/o/mcp`};
}

function buildSystemPrompt(context, history) {
	const groupId = context && context.groupId ? context.groupId : 'unknown';
	const channelId =
		context && context.channelId ? context.channelId : 'unknown';

	const lines = [
		'You are an analytics assistant embedded in Liferay Analytics Cloud (staging).',
		'Answer questions about the analytics data using ONLY the available tools.',
		'',
		'Tools:',
		`- Use mcp__${MCP_SERVER}__get-openapis and get-openapi to discover endpoints.`,
		`- Use mcp__${MCP_SERVER}__call-http-endpoint (GET only) to read data. Never attempt POST/PUT/PATCH/DELETE — you are strictly read-only.`,
		`- When the answer is clearer as a chart, call render_chart with {type (${CHART_TYPES.join(
			'|'
		)}), title, data, xKey, series}.`,
		'',
		`Current context — workspace groupId: ${groupId}, data source channelId: ${channelId}.`,
		'Scope every query to this groupId / channelId unless the user explicitly names another. When an endpoint needs a channel, data source, group, or site identifier, use these values.',
		'Be concise. Prefer a short prose answer, plus a chart when it helps.'
	];

	if (history.length) {
		lines.push('', 'Conversation so far:');

		for (const turn of history) {
			const who = turn.role === 'assistant' ? 'Assistant' : 'User';

			lines.push(`${who}: ${turn.content}`);
		}
	}

	return lines.join('\n');
}

function readJsonBody(req) {
	return new Promise((resolve, reject) => {
		let data = '';

		req.on('data', chunk => {
			data += chunk;

			if (data.length > 1e6) {
				req.destroy();
			}
		});
		req.on('end', () => {
			try {
				resolve(data ? JSON.parse(data) : {});
			} catch (error) {
				reject(error);
			}
		});
		req.on('error', reject);
	});
}

function sse(res, block) {
	res.write(`data: ${JSON.stringify(block)}\n\n`);
}

function friendlyToolName(name) {
	return name.replace(`mcp__${MCP_SERVER}__`, '');
}

async function handleChat(req, res) {
	const {
		apiKey,
		context = {},
		mcpAuth,
		messages = [],
		model
	} = await readJsonBody(req);

	const effectiveKey = resolveApiKey({apiKey});
	const effectiveModel = resolveModel({model});

	res.writeHead(200, {
		'Cache-Control': 'no-cache, no-transform',
		Connection: 'keep-alive',
		'Content-Type': 'text/event-stream',
		'X-Accel-Buffering': 'no'
	});

	if (!effectiveKey) {
		sse(res, {
			code: 'NO_API_KEY',
			message:
				'No Anthropic API key configured. Set one in Settings → AI Assistant.',
			type: 'error'
		});
		sse(res, {type: 'done'});
		res.end();

		return;
	}

	const history = messages.slice(0, -1);
	const last = messages[messages.length - 1];
	const prompt = last && last.content ? last.content : '';

	const {createSdkMcpServer, query, tool} = await import(
		'@anthropic-ai/claude-agent-sdk'
	);
	const {z} = require('zod');

	const renderChart = tool(
		'render_chart',
		'Render a chart in the chat UI from data you fetched. Use when a chart communicates the answer better than prose.',
		{
			data: z.array(
				z.record(z.string(), z.union([z.string(), z.number()]))
			),
			series: z.array(
				z.object({key: z.string(), label: z.string().optional()})
			),
			title: z.string(),
			type: z.enum(CHART_TYPES),
			xKey: z.string()
		},
		async input => {
			const {errors, valid} = validateChartSpec(input);

			if (!valid) {
				return {
					content: [
						{
							text: `Invalid chart spec: ${errors.join(' ')}`,
							type: 'text'
						}
					],
					isError: true
				};
			}

			sse(res, {spec: input, type: 'chart'});

			return {
				content: [{text: 'Chart rendered in the UI.', type: 'text'}]
			};
		}
	);

	try {
		const response = query({
			options: {
				allowedTools: ALLOWED_TOOLS,
				canUseTool: async (toolName, input) => {
					const {allow, reason} = evaluateToolCall(toolName, input);

					return allow
						? {behavior: 'allow'}
						: {behavior: 'deny', message: reason};
				},
				env: {...process.env, ANTHROPIC_API_KEY: effectiveKey},
				maxTurns: MAX_TURNS,
				mcpServers: {
					[CHART_SERVER]: createSdkMcpServer({
						alwaysLoad: true,
						name: CHART_SERVER,
						tools: [renderChart],
						version: '1.0.0'
					}),
					[MCP_SERVER]: resolveMcpServer(mcpAuth)
				},
				model: effectiveModel,
				permissionMode: 'default',
				settingSources: [],
				systemPrompt: buildSystemPrompt(context, history),

				// Disable all built-in tools (Bash, Read, ToolSearch, …). The
				// assistant may only use the MCP read tools and render_chart.
				tools: []
			},
			prompt
		});

		for await (const message of response) {
			if (message.type === 'assistant') {
				for (const block of message.message.content) {
					if (block.type === 'text' && block.text) {
						sse(res, {text: block.text, type: 'text'});
					} else if (
						block.type === 'tool_use' &&
						block.name !== CHART_TOOL
					) {
						sse(res, {
							status: 'running',
							tool: friendlyToolName(block.name),
							type: 'tool_activity'
						});
					}
				}
			} else if (message.type === 'result') {
				if (message.subtype !== 'success') {
					sse(res, {
						message:
							message.result || 'The assistant hit an error.',
						type: 'error'
					});
				}

				break;
			}
		}
	} catch (error) {
		sse(res, {message: String(error && error.message), type: 'error'});
	}

	sse(res, {type: 'done'});
	res.end();
}

// Cheap, token-free Anthropic key check via GET /v1/models. Returns
// {ok:true} on 200, {ok:false,error} otherwise. Backs the settings page's
// "Test connection" button.
async function handleValidate(req, res) {
	res.setHeader('Content-Type', 'application/json');

	const {apiKey} = await readJsonBody(req);
	const guard = missingKeyError(apiKey);

	if (guard) {
		res.statusCode = 400;
		res.end(JSON.stringify(guard));

		return;
	}

	try {
		const response = await fetch('https://api.anthropic.com/v1/models', {
			headers: {
				'anthropic-version': '2023-06-01',
				'x-api-key': apiKey
			}
		});

		if (response.ok) {
			res.end(JSON.stringify({ok: true}));
		} else {
			res.end(
				JSON.stringify({
					error: `Anthropic API returned ${response.status}.`,
					ok: false
				})
			);
		}
	} catch (error) {
		res.end(
			JSON.stringify({error: String(error && error.message), ok: false})
		);
	}
}

// webpack-dev-server `setupMiddlewares` hook. Unshifted so it runs before the
// catch-all proxy that forwards everything else to the upstream Liferay.
function setupAiChatMiddleware(middlewares, devServer) {
	if (!devServer) {
		throw new Error('webpack-dev-server is not defined');
	}

	middlewares.unshift({
		middleware: (req, res, next) => {
			if (req.method !== 'POST') {
				return next();
			}

			handleChat(req, res).catch(error => {
				if (!res.headersSent) {
					res.statusCode = 500;
				}

				sse(res, {
					message: String(error && error.message),
					type: 'error'
				});
				res.end();
			});
		},
		name: 'ai-chat',
		path: PATH
	});

	// Unshifted after `ai-chat` so it sits in front of it: the `/ai-chat` mount
	// would otherwise also match `/ai-chat/validate`.
	middlewares.unshift({
		middleware: (req, res, next) => {
			if (req.method !== 'POST') {
				return next();
			}

			handleValidate(req, res).catch(error => {
				if (!res.headersSent) {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json');
				}

				res.end(
					JSON.stringify({
						error: String(error && error.message),
						ok: false
					})
				);
			});
		},
		name: 'ai-chat-validate',
		path: VALIDATE_PATH
	});

	return middlewares;
}

module.exports = {PATH, VALIDATE_PATH, setupAiChatMiddleware};

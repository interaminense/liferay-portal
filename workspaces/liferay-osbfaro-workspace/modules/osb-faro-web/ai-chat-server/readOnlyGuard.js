/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const MCP_SERVER = 'mcp__liferay-ac-stg__';
const CHART_TOOL = 'mcp__faro_chart__render_chart';

const CALL_HTTP_ENDPOINT = `${MCP_SERVER}call-http-endpoint`;

// The only tools the assistant is allowed to invoke. Everything else (Bash,
// Read, Write, and any other built-in) is denied so the chat can only read
// Analytics Cloud data through the MCP server or render a chart.
const ALLOWED_TOOLS = new Set([
	`${MCP_SERVER}get-openapis`,
	`${MCP_SERVER}get-openapi`,
	CALL_HTTP_ENDPOINT,
	CHART_TOOL
]);

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Decides whether a tool call is allowed under the read-only POC contract.
 *
 * @param {string} toolName Fully-qualified tool name (MCP tools are namespaced).
 * @param {Record<string, unknown>} input The tool call input.
 * @returns {{allow: boolean, reason?: string}}
 */
function evaluateToolCall(toolName, input = {}) {
	if (!ALLOWED_TOOLS.has(toolName)) {
		return {allow: false, reason: `Tool "${toolName}" is not allowed.`};
	}

	if (toolName === CALL_HTTP_ENDPOINT && input.method) {
		const method = String(input.method).toUpperCase();

		if (WRITE_METHODS.has(method)) {
			return {
				allow: false,
				reason: `Method ${method} is blocked: this assistant is read-only.`
			};
		}
	}

	return {allow: true};
}

module.exports = {ALLOWED_TOOLS: [...ALLOWED_TOOLS], evaluateToolCall};

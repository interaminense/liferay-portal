/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Block, ChatEntry} from './types';
import {loadAiConfig} from './config';

import {useCallback, useRef, useState} from 'react';

const ENDPOINT = '/ai-chat';

// Mirrors the route shape /workspace/:groupId/:channelId/... so the assistant
// inherits the workspace and data source the user is currently looking at.
const WORKSPACE_REGEX = /^\/workspace\/([\w.-]+)(?:\/(\d+))?/;

function currentContext(): {channelId: string | null; groupId: string | null} {
	const matches = window.location.pathname.match(WORKSPACE_REGEX);

	return {
		channelId: matches ? matches[2] || null : null,
		groupId: matches ? matches[1] || null : null
	};
}

function historyFrom(entries: ChatEntry[]) {
	return entries
		.filter(entry => entry.block.type === 'text')
		.map(entry => ({
			content: (entry.block as {text: string}).text,
			role: entry.role
		}));
}

/**
 * Drives the chat: keeps the transcript as a flat list of bubbles, POSTs to the
 * dev-server middleware and pushes each streamed block as its own entry.
 */
export function useChatStream() {
	const [entries, setEntries] = useState<ChatEntry[]>([]);
	const [streaming, setStreaming] = useState(false);
	const entriesRef = useRef<ChatEntry[]>([]);

	entriesRef.current = entries;

	const push = useCallback((entry: ChatEntry) => {
		setEntries(prev => [...prev, entry]);
	}, []);

	const send = useCallback(
		async (text: string) => {
			if (!text.trim() || streaming) {
				return;
			}

			const history = historyFrom(entriesRef.current);
			const {apiKey, mcpAuth, model} = loadAiConfig();

			push({block: {text, type: 'text'}, role: 'user'});
			setStreaming(true);

			try {
				const response = await fetch(ENDPOINT, {
					body: JSON.stringify({
						apiKey,
						context: currentContext(),
						mcpAuth,
						messages: [...history, {content: text, role: 'user'}],
						model
					}),
					headers: {'Content-Type': 'application/json'},
					method: 'POST'
				});

				if (!response.body) {
					throw new Error('No response stream.');
				}

				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let buffer = '';

				for (;;) {
					const {done, value} = await reader.read();

					if (done) {
						break;
					}

					buffer += decoder.decode(value, {stream: true});

					const chunks = buffer.split('\n\n');

					buffer = chunks.pop() || '';

					for (const chunk of chunks) {
						const line = chunk.trim();

						if (!line.startsWith('data:')) {
							continue;
						}

						const block: Block = JSON.parse(line.slice(5).trim());

						if (block.type !== 'done') {
							push({block, role: 'assistant'});
						}
					}
				}
			} catch (error) {
				push({
					block: {
						message:
							error instanceof Error
								? error.message
								: 'Request failed.',
						type: 'error'
					},
					role: 'assistant'
				});
			} finally {
				setStreaming(false);
			}
		},
		[push, streaming]
	);

	return {entries, send, streaming};
}

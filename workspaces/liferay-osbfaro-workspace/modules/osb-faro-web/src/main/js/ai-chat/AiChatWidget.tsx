/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ChartBlock from './ChartBlock';
import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import React, {useEffect, useRef, useState} from 'react';
import ReactMarkdown, {Components} from 'react-markdown';

import remarkGfm from 'remark-gfm';
import {ChatEntry} from './types';
import {useChatStream} from './useChatStream';

const MD_COMPONENTS: Components = {
	p: ({children}) => <p style={{margin: '0 0 6px'}}>{children}</p>
};

const styles: Record<string, React.CSSProperties> = {
	activity: {
		color: '#6b6c7e',
		fontSize: 12,
		fontStyle: 'italic',
		marginBottom: 8
	},
	bubbleAssistant: {
		background: '#f1f2f5',
		borderRadius: 8,
		marginBottom: 12,
		marginRight: 'auto',
		maxWidth: '85%',
		padding: '8px 12px',
		width: 'fit-content'
	},
	bubbleChart: {
		background: '#f1f2f5',
		borderRadius: 8,
		marginBottom: 12,
		padding: '8px 12px',
		width: '100%'
	},
	bubbleUser: {
		background: '#0b5fff',
		borderRadius: 8,
		color: '#fff',
		marginBottom: 12,
		marginLeft: 'auto',
		maxWidth: '85%',
		padding: '8px 12px',
		whiteSpace: 'pre-wrap',
		width: 'fit-content'
	},
	error: {color: '#da1414', fontSize: 13, marginBottom: 8},
	fab: {
		borderRadius: '50%',
		bottom: 24,
		height: 52,
		position: 'fixed',
		right: 24,
		width: 52,
		zIndex: 1000
	},
	footer: {
		borderTop: '1px solid #e7e7ed',
		display: 'flex',
		gap: 8,
		padding: 12
	},
	header: {
		alignItems: 'center',
		borderBottom: '1px solid #e7e7ed',
		display: 'flex',
		fontWeight: 600,
		justifyContent: 'space-between',
		padding: '12px 16px'
	},
	input: {
		border: '1px solid #cdced9',
		borderRadius: 4,
		flex: 1,
		padding: '6px 10px'
	},
	list: {flex: 1, overflowY: 'auto', padding: 16},
	panel: {
		background: '#fff',
		borderRadius: 8,
		bottom: 24,
		boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
		display: 'flex',
		flexDirection: 'column',
		height: 560,
		position: 'fixed',
		right: 24,
		width: 420,
		zIndex: 1000
	}
};

function settingsHref(): string {
	const match = window.location.pathname.match(/^\/workspace\/([\w.-]+)/);
	const groupId = match ? match[1] : '';

	return `/workspace/${groupId}/settings/ai-assistant`;
}

function renderEntry(entry: ChatEntry, index: number) {
	const {block, role} = entry;

	if (role === 'user') {
		return (
			<div key={index} style={styles.bubbleUser}>
				{block.type === 'text' ? block.text : ''}
			</div>
		);
	}

	switch (block.type) {
		case 'text':
			return (
				<div
					className='ai-chat-markdown'
					key={index}
					style={styles.bubbleAssistant}
				>
					<ReactMarkdown
						components={MD_COMPONENTS}
						remarkPlugins={[remarkGfm]}
					>
						{block.text}
					</ReactMarkdown>
				</div>
			);
		case 'chart':
			return (
				<div key={index} style={styles.bubbleChart}>
					<ChartBlock spec={block.spec} />
				</div>
			);
		case 'tool_activity':
			return (
				<div key={index} style={styles.activity}>
					{`\u{1F527} ${block.tool}…`}
				</div>
			);
		case 'error':
			if (block.code === 'NO_API_KEY') {
				return (
					<div key={index} style={styles.error}>
						{'No Anthropic API key configured. '}

						<a href={settingsHref()}>
							{'Open Settings → AI Assistant'}
						</a>
					</div>
				);
			}

			return (
				<div key={index} style={styles.error}>
					{block.message}
				</div>
			);
		default:
			return null;
	}
}

const AiChatWidget: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState('');
	const {entries, send, streaming} = useChatStream();
	const listRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTop = listRef.current.scrollHeight;
		}
	}, [entries]);

	const submit = () => {
		send(draft);
		setDraft('');
	};

	if (!open) {
		return (
			<ClayButton
				aria-label='Open analytics assistant'
				displayType='primary'
				onClick={() => setOpen(true)}
				style={styles.fab}
			>
				<ClayIcon symbol='message' />
			</ClayButton>
		);
	}

	return (
		<div style={styles.panel}>
			<div style={styles.header}>
				<span>{'Analytics Assistant'}</span>

				<ClayButton
					aria-label='Close'
					displayType='unstyled'
					onClick={() => setOpen(false)}
				>
					<ClayIcon symbol='times' />
				</ClayButton>
			</div>

			<div ref={listRef} style={styles.list}>
				{entries.length === 0 ? (
					<p style={styles.activity}>
						{
							'Ask about your analytics data — e.g. "unique visitors this month".'
						}
					</p>
				) : (
					entries.map((entry, index) => renderEntry(entry, index))
				)}
			</div>

			<div style={styles.footer}>
				<input
					disabled={streaming}
					onChange={event => setDraft(event.target.value)}
					onKeyDown={event => {
						if (event.key === 'Enter') {
							submit();
						}
					}}
					placeholder={streaming ? 'Thinking…' : 'Ask a question…'}
					style={styles.input}
					value={draft}
				/>

				<ClayButton
					disabled={streaming || !draft.trim()}
					displayType='primary'
					onClick={submit}
				>
					<ClayIcon symbol='order-arrow-right' />
				</ClayButton>
			</div>
		</div>
	);
};

export default AiChatWidget;

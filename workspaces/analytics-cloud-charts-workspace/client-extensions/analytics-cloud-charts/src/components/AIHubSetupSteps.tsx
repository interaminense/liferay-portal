/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

const FIELD_LIST_STYLE: React.CSSProperties = {
	background: '#f7f8fa',
	border: '1px solid #e7e7ed',
	borderRadius: 4,
	fontSize: 12,
	listStyle: 'none',
	margin: '8px 0',
	padding: '8px 12px',
};

const FIELD_ITEM_STYLE: React.CSSProperties = {
	display: 'flex',
	gap: 8,
	padding: '4px 0',
};

const FIELD_NAME_STYLE: React.CSSProperties = {
	color: '#272833',
	fontFamily:
		'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
	fontWeight: 600,
	minWidth: 110,
};

const CODE_INLINE_STYLE: React.CSSProperties = {
	background: '#f0f1f5',
	borderRadius: 3,
	fontFamily:
		'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
	fontSize: 12,
	padding: '1px 6px',
};

const STEP_LIST_STYLE: React.CSSProperties = {
	fontSize: 13,
	lineHeight: 1.6,
	marginBottom: 0,
	paddingLeft: 18,
};

const SUB_LIST_STYLE: React.CSSProperties = {
	fontSize: 13,
	listStyle: 'disc',
	margin: '4px 0',
	paddingLeft: 18,
};

const SYSTEM_PROMPT_STYLE: React.CSSProperties = {
	background: '#1f2937',
	borderRadius: 4,
	color: '#e5e7eb',
	fontFamily:
		'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
	fontSize: 11,
	lineHeight: 1.5,
	marginTop: 6,
	padding: '10px 12px',
	whiteSpace: 'pre-wrap',
	wordBreak: 'break-word',
};

export const AIHubSetupSteps: React.FC = () => (
	<ol style={STEP_LIST_STYLE}>
		<li>
			Enable feature flag{' '}
			<code style={CODE_INLINE_STYLE}>LPD-62272</code> in{' '}
			<strong>
				Control Panel → System Settings → Feature Flags → AI Hub
			</strong>
			.
		</li>

		<li>
			Configure Vertex AI in{' '}
			<strong>
				Control Panel → System Settings → AI Hub → Vertex AI
				Configuration
			</strong>
			:
			<ul style={SUB_LIST_STYLE}>
				<li>
					<code style={CODE_INLINE_STYLE}>projectId</code> — your
					Google Cloud project
				</li>
				<li>
					<code style={CODE_INLINE_STYLE}>location</code> — e.g.{' '}
					<code style={CODE_INLINE_STYLE}>us-central1</code>
				</li>
				<li>
					<code style={CODE_INLINE_STYLE}>modelName</code> — e.g.{' '}
					<code style={CODE_INLINE_STYLE}>gemini-2.0-flash</code>
				</li>
			</ul>
		</li>

		<li>
			Point{' '}
			<code style={CODE_INLINE_STYLE}>
				GOOGLE_APPLICATION_CREDENTIALS
			</code>{' '}
			to a service-account JSON in your bundle&apos;s{' '}
			<code style={CODE_INLINE_STYLE}>setenv.sh</code> and restart the
			bundle.
		</li>

		<li>
			In <strong>Control Panel → AI Hub → Chatbots</strong>, click{' '}
			<strong>+</strong> and create a chatbot:
			<ul style={FIELD_LIST_STYLE}>
				<li style={FIELD_ITEM_STYLE}>
					<span style={FIELD_NAME_STYLE}>ERC</span>
					<span>
						<code style={CODE_INLINE_STYLE}>ACC_INSIGHTS</code>{' '}
						<span className="text-secondary">
							(must match exactly)
						</span>
					</span>
				</li>
				<li style={FIELD_ITEM_STYLE}>
					<span style={FIELD_NAME_STYLE}>Title</span>
					<span>Analytics Cloud Insights</span>
				</li>
			</ul>
		</li>

		<li>
			Link the chatbot to an <strong>Agent Definition</strong> with this
			system prompt:
			<div style={SYSTEM_PROMPT_STYLE}>
				You are an analytics assistant. Given a JSON snapshot of an
				Analytics Cloud metric and its label, write 1-2 short, factual
				English sentences highlighting the most notable observation
				(trend, anomaly, comparison). Do not invent numbers. Do not
				use markdown. Do not exceed 240 characters.
			</div>
		</li>
	</ol>
);

export default AIHubSetupSteps;

/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayPanel from '@clayui/panel';
import React from 'react';

import {AIHubSetupSteps} from './AIHubSetupSteps';

export interface SetupRequiredEmptyStateIProps {
	acConnected?: boolean;
	objectCreated?: boolean;
}

const SPRITEMAP =
	typeof window !== 'undefined'
		? (
				window as unknown as {
					Liferay?: {Icons?: {spritemap?: string}};
				}
			).Liferay?.Icons?.spritemap
		: undefined;

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

interface BadgeProps {
	color: string;
	background: string;
	label: string;
}

const Badge: React.FC<BadgeProps> = ({background, color, label}) => (
	<span
		style={{
			background,
			borderRadius: 10,
			color,
			fontSize: 10,
			fontWeight: 700,
			letterSpacing: '0.04em',
			marginLeft: 8,
			padding: '2px 8px',
			textTransform: 'uppercase',
		}}
	>
		{label}
	</span>
);

const REQUIRED_BADGE = (
	<Badge background="#FFE5E7" color="#B0001A" label="Required" />
);

const OPTIONAL_BADGE = (
	<Badge background="#F0F1F5" color="#6B6C7E" label="Optional" />
);

const DONE_BADGE = (
	<Badge background="#E5F5EC" color="#287D3C" label="Done" />
);

const renderStepTitle = (
	number: string,
	label: string,
	badge: JSX.Element,
	completed: boolean
) => (
	<span style={{alignItems: 'center', display: 'inline-flex', gap: 6}}>
		<span
			style={{
				color: completed ? '#287D3C' : '#6B6C7E',
				fontWeight: completed ? 700 : 400,
				marginRight: 4,
			}}
		>
			{completed ? '✓' : `${number}.`}
		</span>
		<span style={{fontWeight: 600}}>{label}</span>
		{completed ? DONE_BADGE : badge}
	</span>
);

export const SetupRequiredEmptyState: React.FC<
	SetupRequiredEmptyStateIProps
> = ({acConnected = false, objectCreated = false}) => {
	const step1Expanded = !objectCreated;
	const step2Expanded = objectCreated && !acConnected;

	return (
		<div
			style={{
				margin: '0 auto',
				maxWidth: 640,
				padding: '12px 0',
			}}
		>
			<div
				style={{
					color: '#272833',
					fontSize: 18,
					fontWeight: 600,
					marginBottom: 6,
				}}
			>
				Setup required
			</div>

			<div
				className="text-secondary"
				style={{
					fontSize: 13,
					lineHeight: 1.5,
					marginBottom: 16,
				}}
			>
				Complete the steps below to start using the widget. Click each
				step to expand the instructions.
			</div>

			<ClayPanel.Group>
				<ClayPanel
					collapsable
					defaultExpanded={step1Expanded}
					displayTitle={renderStepTitle(
						'1',
						'Create the custom object',
						REQUIRED_BADGE,
						objectCreated
					)}
					displayType="secondary"
					showCollapseIcon
					spritemap={SPRITEMAP}
				>
					<ClayPanel.Body>
						<p
							className="text-secondary"
							style={{fontSize: 13, marginBottom: 8}}
						>
							The widget stores its per-instance configuration
							(metric, time range, colors, AI toggle) in a
							custom object.
						</p>

						<ol style={STEP_LIST_STYLE}>
							<li>
								Open{' '}
								<strong>
									Control Panel → Custom Objects
								</strong>{' '}
								and click the <strong>+</strong> button.
							</li>

							<li>
								Fill in the basics:
								<ul style={FIELD_LIST_STYLE}>
									<li style={FIELD_ITEM_STYLE}>
										<span style={FIELD_NAME_STYLE}>
											Name
										</span>
										<span>
											<code style={CODE_INLINE_STYLE}>
												AnalyticsCloudChartsPreferences
											</code>{' '}
											<span className="text-secondary">
												(must match exactly)
											</span>
										</span>
									</li>

									<li style={FIELD_ITEM_STYLE}>
										<span style={FIELD_NAME_STYLE}>
											Plural Label
										</span>
										<span>
											Analytics Cloud Charts Preferences
										</span>
									</li>

									<li style={FIELD_ITEM_STYLE}>
										<span style={FIELD_NAME_STYLE}>
											Scope
										</span>
										<span>Company</span>
									</li>
								</ul>
							</li>

							<li>
								Open the <strong>Fields</strong> tab and add
								two fields:
								<ul style={FIELD_LIST_STYLE}>
									<li style={FIELD_ITEM_STYLE}>
										<span style={FIELD_NAME_STYLE}>
											instanceId
										</span>
										<span>
											Type <strong>Text</strong>,{' '}
											<strong>Required</strong>,{' '}
											<strong>Indexed</strong>
										</span>
									</li>

									<li style={FIELD_ITEM_STYLE}>
										<span style={FIELD_NAME_STYLE}>
											preferences
										</span>
										<span>
											Type <strong>Long Text</strong>
										</span>
									</li>
								</ul>
							</li>

							<li>
								Click <strong>Save</strong>, then click{' '}
								<strong>Publish</strong> in the top-right
								corner.
							</li>

							<li>
								Reload this page. The widget will create its
								first entry and grant{' '}
								<code style={CODE_INLINE_STYLE}>View</code>{' '}
								permission to{' '}
								<code style={CODE_INLINE_STYLE}>Guest</code>{' '}
								and{' '}
								<code style={CODE_INLINE_STYLE}>User</code>{' '}
								roles automatically.
							</li>
						</ol>
					</ClayPanel.Body>
				</ClayPanel>

				<ClayPanel
					collapsable
					defaultExpanded={step2Expanded}
					displayTitle={renderStepTitle(
						'2',
						'Connect to Analytics Cloud',
						REQUIRED_BADGE,
						acConnected
					)}
					displayType="secondary"
					showCollapseIcon
					spritemap={SPRITEMAP}
				>
					<ClayPanel.Body>
						<p
							className="text-secondary"
							style={{fontSize: 13, marginBottom: 8}}
						>
							The widget reads metrics from your Analytics Cloud
							workspace via the AC GraphQL proxy. Without this
							connection the metric cards will show no data.
						</p>

						<ol style={STEP_LIST_STYLE}>
							<li>
								Sign in to your Analytics Cloud workspace at{' '}
								<a
									href="https://analytics.liferay.com"
									rel="noopener noreferrer"
									target="_blank"
								>
									analytics.liferay.com
								</a>{' '}
								(or your self-hosted instance) and confirm
								you have a <strong>Project</strong> with at
								least one <strong>Channel</strong> receiving
								data.
							</li>

							<li>
								In Liferay DXP, open{' '}
								<strong>
									Control Panel → Configuration → Analytics
									Cloud
								</strong>
								.
							</li>

							<li>
								Click <strong>Connect to Analytics Cloud</strong>{' '}
								and complete the OAuth consent flow with your
								AC account.
							</li>

							<li>
								After connecting, select the AC{' '}
								<strong>Project</strong> and{' '}
								<strong>Channel</strong> to sync. The widget
								picks up the channel id automatically through
								the page&apos;s site context.
							</li>

							<li>
								Wait until the first sync completes (a few
								minutes). Reload the page — the time range
								dropdown in the widget header populates and
								metric cards start rendering data.
							</li>
						</ol>

						<p
							className="text-secondary"
							style={{
								fontSize: 12,
								lineHeight: 1.5,
								marginBottom: 0,
								marginTop: 12,
							}}
						>
							If you see <strong>HTTP 502 Unable to reach
							Analytics Cloud</strong> the connection or the
							token expired — repeat the OAuth step.
						</p>
					</ClayPanel.Body>
				</ClayPanel>

				<ClayPanel
					collapsable
					defaultExpanded={false}
					displayTitle={renderStepTitle(
						'3',
						'Enable Liferay AI Hub',
						OPTIONAL_BADGE,
						false
					)}
					displayType="secondary"
					showCollapseIcon
					spritemap={SPRITEMAP}
				>
					<ClayPanel.Body>
						<p
							className="text-secondary"
							style={{fontSize: 13, marginBottom: 8}}
						>
							Enables the <strong>Auto-narrative insights</strong>{' '}
							feature — short AI-generated summaries below each
							chart. The widget works without it; this step is
							only required if you want the AI insights toggle
							in the settings modal to function.
						</p>

						<AIHubSetupSteps />
					</ClayPanel.Body>
				</ClayPanel>
			</ClayPanel.Group>
		</div>
	);
};

export default SetupRequiredEmptyState;

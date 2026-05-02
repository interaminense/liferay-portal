/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo, useState} from 'react';

import {useAIInsight} from '../hooks/useAIInsight';
import {buildInsightPrompt} from '../lib/ai-hub';
import {useChartPalette} from '../lib/chart-palette';

export interface AIInsightCalloutIProps {
	data: unknown;
	enabled: boolean;
	metricLabel: string;
}

const SparkleIcon: React.FC<{color: string}> = ({color}) => (
	<svg
		aria-hidden="true"
		fill={color}
		focusable="false"
		height="14"
		viewBox="0 0 24 24"
		width="14"
	>
		<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2zm6 13l1 2.6 2.6 1-2.6 1L18 22l-1-2.4-2.6-1 2.6-1L18 15z" />
	</svg>
);

const RefreshIcon: React.FC = () => (
	<svg
		aria-hidden="true"
		fill="currentColor"
		focusable="false"
		height="12"
		viewBox="0 0 24 24"
		width="12"
	>
		<path d="M17.65 6.35A7.958 7.958 0 0012 4a8 8 0 100 16 7.96 7.96 0 007.5-5.27l-1.95-.55A6 6 0 1112 6c1.58 0 3.04.61 4.16 1.6L13 11h7V4l-2.35 2.35z" />
	</svg>
);

const DismissIcon: React.FC = () => (
	<svg
		aria-hidden="true"
		fill="currentColor"
		focusable="false"
		height="12"
		viewBox="0 0 24 24"
		width="12"
	>
		<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
	</svg>
);

export const AIInsightCallout: React.FC<AIInsightCalloutIProps> = ({
	data,
	enabled,
	metricLabel,
}) => {
	const palette = useChartPalette();
	const accent = palette[0];

	const [dismissed, setDismissed] = useState(false);

	const prompt = useMemo(() => {
		if (!enabled || data == null) {
			return null;
		}

		return buildInsightPrompt(metricLabel, data);
	}, [data, enabled, metricLabel]);

	const {error, insight, loading, refresh} = useAIInsight(enabled, prompt);

	if (!enabled || dismissed) {
		return null;
	}

	const containerStyle: React.CSSProperties = {
		background: '#F0F6FF',
		borderLeft: `4px solid ${accent}`,
		borderRadius: 4,
		marginTop: 16,
		padding: '12px 14px',
	};

	const headerStyle: React.CSSProperties = {
		alignItems: 'center',
		display: 'flex',
		gap: 6,
		justifyContent: 'space-between',
		marginBottom: 6,
	};

	const labelStyle: React.CSSProperties = {
		alignItems: 'center',
		color: accent,
		display: 'flex',
		fontSize: 10,
		fontWeight: 700,
		gap: 6,
		letterSpacing: '0.06em',
		textTransform: 'uppercase',
	};

	const actionStyle: React.CSSProperties = {
		alignItems: 'center',
		background: 'transparent',
		border: 0,
		color: '#6B6C7E',
		cursor: 'pointer',
		display: 'inline-flex',
		padding: 4,
	};

	return (
		<div style={containerStyle}>
			<div style={headerStyle}>
				<span style={labelStyle}>
					<SparkleIcon color={accent} /> AI Insight
				</span>

				<span style={{display: 'flex', gap: 4}}>
					<button
						aria-label="Refresh insight"
						disabled={loading}
						onClick={refresh}
						style={{
							...actionStyle,
							opacity: loading ? 0.4 : 1,
						}}
						title="Refresh insight"
						type="button"
					>
						<RefreshIcon />
					</button>

					<button
						aria-label="Dismiss insight"
						onClick={() => setDismissed(true)}
						style={actionStyle}
						title="Dismiss"
						type="button"
					>
						<DismissIcon />
					</button>
				</span>
			</div>

			{loading && !insight && (
				<div className="text-secondary" style={{fontSize: 13}}>
					Generating insight…
				</div>
			)}

			{insight && (
				<div
					style={{
						color: '#272833',
						fontSize: 13,
						lineHeight: 1.5,
					}}
				>
					{insight}
				</div>
			)}

			{error && !insight && !loading && (
				<div
					className="text-secondary"
					style={{fontSize: 12, lineHeight: 1.4}}
					title={error.message}
				>
					{error.message || 'Insight unavailable'}
				</div>
			)}
		</div>
	);
};

export default AIInsightCallout;

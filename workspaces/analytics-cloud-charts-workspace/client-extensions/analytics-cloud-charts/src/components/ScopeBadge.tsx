/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import {MetricScope} from '../lib/metric-info';

interface BadgeStyle {
	background: string;
	color: string;
	label: string;
}

const SCOPE_BADGE: Record<MetricScope, BadgeStyle> = {
	'asset-level': {
		background: '#FFF3E0',
		color: '#B95000',
		label: 'Asset',
	},
	'page-level': {
		background: '#E5F5EC',
		color: '#287D3C',
		label: 'Page',
	},
	'site-level': {
		background: '#F0F1F5',
		color: '#6B6C7E',
		label: 'Site',
	},
};

export interface ScopeBadgeIProps {
	scope: MetricScope;
}

export const ScopeBadge: React.FC<ScopeBadgeIProps> = ({scope}) => {
	const badge = SCOPE_BADGE[scope];

	return (
		<span
			style={{
				background: badge.background,
				borderRadius: 10,
				color: badge.color,
				flexShrink: 0,
				fontSize: 10,
				fontWeight: 600,
				letterSpacing: '0.04em',
				padding: '2px 8px',
				textTransform: 'uppercase',
			}}
		>
			{badge.label}
		</span>
	);
};

export default ScopeBadge;

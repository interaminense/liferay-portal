/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';
import {
	ResponsiveContainer,
	Sankey as RechartsSankey,
	Tooltip,
	TooltipProps,
} from 'recharts';

import {useChartPalette} from '../../lib/chart-palette';
import {toThousands} from '../../lib/charts';

export interface SankeyNode {
	canonicalUrl?: string | null;
	external?: boolean | null;
	name: string;
}

export interface SankeyLink {
	source: number;
	target: number;
	value: number;
}

export interface SankeyData {
	links: SankeyLink[];
	nodes: SankeyNode[];
}

export interface SankeyIProps {
	data: SankeyData;
	height?: number;
	metricLabel?: string;
}

interface SankeyNodeRenderProps {
	containerWidth?: number;
	height?: number;
	index?: number;
	payload?: SankeyNode;
	width?: number;
	x?: number;
	y?: number;
}

const SankeyNodeRenderer: React.FC<SankeyNodeRenderProps> = ({
	containerWidth = 0,
	height = 0,
	payload,
	width = 0,
	x = 0,
	y = 0,
}) => {
	const palette = useChartPalette();

	if (!payload) {
		return null;
	}

	const isLeft = x + width / 2 < containerWidth / 2;

	return (
		<g>
			<rect
				fill={palette[0]}
				height={height}
				width={width}
				x={x}
				y={y}
			/>

			<text
				dominantBaseline="middle"
				fill="#272833"
				fontSize={12}
				textAnchor={isLeft ? 'start' : 'end'}
				x={isLeft ? x + width + 6 : x - 6}
				y={y + height / 2}
			>
				{payload.name}
			</text>
		</g>
	);
};

const renderTooltip = (
	props: TooltipProps<number, string>,
	metricLabel: string
) => {
	if (!props.active || !props.payload?.length) {
		return null;
	}

	const datum = props.payload[0].payload as {
		name?: string;
		source?: SankeyNode | number;
		target?: SankeyNode | number;
		value?: number;
	};

	const isLink =
		datum?.source !== undefined && datum?.target !== undefined;

	if (isLink) {
		const sourceName =
			typeof datum.source === 'object'
				? datum.source?.name
				: String(datum.source ?? '');
		const targetName =
			typeof datum.target === 'object'
				? datum.target?.name
				: String(datum.target ?? '');

		return (
			<div
				className="bg-white border rounded shadow-sm"
				style={{padding: '0.5rem 0.75rem', minWidth: 220}}
			>
				<div className="font-weight-semi-bold text-truncate">
					{sourceName}
				</div>

				<div className="text-secondary">↓</div>

				<div className="font-weight-semi-bold text-truncate">
					{targetName}
				</div>

				<div className="mt-1">
					<span className="font-weight-semi-bold">
						{toThousands(datum.value)}
					</span>{' '}
					<span className="text-secondary">{metricLabel}</span>
				</div>
			</div>
		);
	}

	return (
		<div
			className="bg-white border rounded shadow-sm"
			style={{padding: '0.5rem 0.75rem', minWidth: 200}}
		>
			<div className="font-weight-semi-bold text-truncate">
				{datum?.name ?? '—'}
			</div>

			<div className="mt-1">
				<span className="font-weight-semi-bold">
					{toThousands(datum?.value)}
				</span>{' '}
				<span className="text-secondary">{metricLabel}</span>
			</div>
		</div>
	);
};

const CLASSNAME = 'analytics-sankey';

export const Sankey: React.FC<SankeyIProps> = ({
	data,
	height = 400,
	metricLabel = 'views',
}) => {
	const palette = useChartPalette();

	return (
		<div className={CLASSNAME}>
			<ResponsiveContainer height={height} width="100%">
				<RechartsSankey
					data={data}
					link={{stroke: palette[0], strokeOpacity: 0.35}}
					linkCurvature={0.3}
					margin={{bottom: 20, left: 100, right: 100, top: 20}}
					node={<SankeyNodeRenderer />}
					nodePadding={50}
					nodeWidth={10}
					sort={false}
				>
					<Tooltip
						allowEscapeViewBox={{x: true, y: true}}
						content={(props) =>
							renderTooltip(props, metricLabel)
						}
					/>
				</RechartsSankey>
			</ResponsiveContainer>
		</div>
	);
};

export default Sankey;

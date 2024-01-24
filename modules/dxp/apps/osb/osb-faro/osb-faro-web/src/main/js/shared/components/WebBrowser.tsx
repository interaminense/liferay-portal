import {Alignments} from './chart-tooltip';
import React, {useState} from 'react';
import TextTruncate from 'shared/components/TextTruncate';
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Sector,
	Tooltip as RechartsTooltip
} from 'recharts';
import {Colors} from 'shared/util/charts';
import {get} from 'lodash';
import {getPercentage} from 'shared/util/util';
import {toRounded, toThousands} from 'shared/util/numbers';
import {TooltipTemplate} from './chart-tooltip/TooltipTemplate';
import {Text} from '@clayui/core';

const CLASSNAME = 'analytics-web-browser-chart';

const getChartPercentage = (value, total) =>
	`${toRounded(getPercentage(value, total))}%`;

const Tooltip = ({active, metricLabel, payload, total}) => {
	if (active && payload && !!payload.length) {
		const {value, valueKey} = get(payload, [0, 'payload'], {});

		return (
			<TooltipTemplate>
				<TooltipTemplate.Header>
					<TooltipTemplate.Row>
						<TooltipTemplate.HeaderColumn>
							{valueKey}
						</TooltipTemplate.HeaderColumn>

						<TooltipTemplate.HeaderColumn />
					</TooltipTemplate.Row>
				</TooltipTemplate.Header>

				<TooltipTemplate.Body>
					<TooltipTemplate.Row>
						<TooltipTemplate.Column>
							{toThousands(value)} {metricLabel}
						</TooltipTemplate.Column>

						<TooltipTemplate.Column align={Alignments.Right}>
							{getChartPercentage(value, total)}
						</TooltipTemplate.Column>
					</TooltipTemplate.Row>
				</TooltipTemplate.Body>
			</TooltipTemplate>
		);
	}

	return null;
};

const renderActiveShape = ({
	cx,
	cy,
	endAngle,
	fill,
	innerRadius,
	outerRadius,
	startAngle
}) => {
	return (
		<g>
			<Sector
				cx={cx}
				cy={cy}
				endAngle={endAngle}
				fill={fill}
				innerRadius={innerRadius}
				outerRadius={outerRadius + 4}
				startAngle={startAngle}
			/>
		</g>
	);
};

export const WebBrowser = ({
	browsers = [],
	height = 370,
	metricLabel,
	total
}) => {
	const [hoverIndex, setHoverIndex] = useState(-1);

	return (
		<div className={CLASSNAME}>
			<ResponsiveContainer height={height}>
				<PieChart>
					<RechartsTooltip
						content={({active, payload}) => (
							<Tooltip
								active={active}
								metricLabel={metricLabel}
								payload={payload}
								total={total}
							/>
						)}
					/>

					<Legend
						align='right'
						formatter={(val, {payload: {value, valueKey}}: any) => (
							<div className='text-secondary'>
								<TextTruncate
									inline
									maxCharLength={24}
									title={valueKey}
								/>

								<Text size={3}>
									{getChartPercentage(value, total)}
								</Text>
							</div>
						)}
						// iconSize={14}
						layout='vertical'
						onMouseMove={(e, index) => setHoverIndex(index)}
						onMouseOut={() => setHoverIndex(-1)}
						verticalAlign='middle'
					/>

					<Pie
						activeIndex={hoverIndex}
						activeShape={renderActiveShape}
						blendStroke
						className='col-7'
						cy={185}
						data={browsers}
						dataKey='value'
						endAngle={-270}
						innerRadius='50%'
						isAnimationActive={false}
						legendType='circle'
						onMouseMove={(e, index) => setHoverIndex(index)}
						onMouseOut={() => setHoverIndex(-1)}
						startAngle={90}
					>
						{browsers.map((browser, index) => (
							<Cell
								fill={Colors.pallete[index]}
								fillOpacity={
									hoverIndex >= 0 && hoverIndex !== index
										? 0.2
										: 1
								}
								key={`cell-${index}`}
								strokeOpacity={
									hoverIndex >= 0 && hoverIndex !== index
										? 0
										: 1
								}
							/>
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};

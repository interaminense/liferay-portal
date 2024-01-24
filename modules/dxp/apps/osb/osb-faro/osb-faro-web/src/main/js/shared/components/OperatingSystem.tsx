import {Alignments} from 'shared/components/chart-tooltip';
import React from 'react';
import {AXIS, getAxisTickText} from 'shared/util/recharts';
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Label,
	ResponsiveContainer,
	Tooltip as RechartsTooltip,
	XAxis,
	YAxis
} from 'recharts';
import {Colors} from 'shared/util/charts';
import {range} from 'lodash';
import {sub} from 'shared/util/lang';
import {toRounded, toThousands} from 'shared/util/numbers';
import {TooltipTemplate} from './chart-tooltip/TooltipTemplate';
import Circle from './Circle';

const CLASSNAME = 'analytics-operating-system-chart';
const MIN_VALUE = '< 0.1%';

const getItemPercentage = percentage => {
	if (percentage < 0.1) {
		return `${MIN_VALUE}`;
	}

	return `${toRounded(percentage)}%`;
};

const Tooltip = ({active, metricLabel, payload}) => {
	if (active && payload && !!payload.length) {
		const {
			payload: {label, percentageOfTotal, totalViews}
		} = payload[0];

		return (
			<TooltipTemplate>
				<TooltipTemplate.Header>
					<TooltipTemplate.Row>
						<TooltipTemplate.HeaderColumn>
							{label}
						</TooltipTemplate.HeaderColumn>

						<TooltipTemplate.HeaderColumn align={Alignments.Right}>
							{`${toThousands(totalViews)} ${metricLabel}`}
						</TooltipTemplate.HeaderColumn>

						<TooltipTemplate.HeaderColumn align={Alignments.Right}>
							{getItemPercentage(percentageOfTotal)}
						</TooltipTemplate.HeaderColumn>
					</TooltipTemplate.Row>
				</TooltipTemplate.Header>

				<TooltipTemplate.Body>
					{payload.map(({color, payload: {data}}, i) => {
						const {percentage, type, views} = data[i];

						return (
							<TooltipTemplate.Row key={i}>
								<TooltipTemplate.Column>
									<Circle color={color} /> {type}
								</TooltipTemplate.Column>

								<TooltipTemplate.Column
									align={Alignments.Right}
								>
									{toThousands(views)}
								</TooltipTemplate.Column>

								{type !== 'Other' && (
									<TooltipTemplate.Column
										align={Alignments.Right}
									>
										{getItemPercentage(percentage)}
									</TooltipTemplate.Column>
								)}
							</TooltipTemplate.Row>
						);
					})}
				</TooltipTemplate.Body>
			</TooltipTemplate>
		);
	}

	return null;
};

export const OperatingSystem = ({
	devices = [],
	height = 370,
	metricLabel = Liferay.Language.get('views')
}) => {
	const barCount = devices.reduce((acc, {data}) => {
		const count = data.length;

		return count > acc ? count : acc;
	}, 0);

	return (
		<div className={CLASSNAME}>
			<ResponsiveContainer height={height}>
				<ComposedChart data={devices}>
					<CartesianGrid
						stroke={AXIS.gridStroke}
						strokeDasharray='3 3'
						vertical={false}
					>
						<Label
							position='center'
							value={
								sub(
									Liferay.Language.get(
										'empty-message-metric'
									),
									[metricLabel.toLowerCase()]
								) as string
							}
						/>
					</CartesianGrid>

					<XAxis
						axisLine={{stroke: AXIS.borderStroke}}
						dataKey='label'
						interval='preserveStart'
						padding={{left: 20, right: 20}}
						tick={getAxisTickText('x')}
						tickLine={false}
						tickMargin={12}
					/>

					<XAxis
						axisLine={{stroke: AXIS.borderStroke}}
						dataKey='label'
						height={1}
						orientation='top'
						tick={false}
						tickLine={false}
						xAxisId='top'
					/>

					<YAxis
						allowDecimals={false}
						axisLine={{stroke: AXIS.borderStroke}}
						name={Liferay.Language.get('views')}
						tick={getAxisTickText('y', toThousands)}
						tickCount={6}
						tickLine={false}
						type='number'
						width={30}
					/>

					<YAxis
						axisLine={{stroke: AXIS.borderStroke}}
						orientation='right'
						tick={false}
						tickLine={false}
						type='number'
						width={1}
						yAxisId='right'
					/>

					<RechartsTooltip
						content={({active, payload}) => (
							<Tooltip
								active={active}
								metricLabel={metricLabel}
								payload={payload}
							/>
						)}
					/>

					{range(0, barCount).map(i => (
						<Bar
							dataKey={`data[${i}].views`}
							fill={Colors.pallete[i]}
							isAnimationActive={false}
							key={i}
							stackId='devices'
						/>
					))}
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	);
};

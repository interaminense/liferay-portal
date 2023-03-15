import autobind from 'autobind-decorator';
import CardTabs from 'shared/components/CardTabs';
import ChartTooltip from 'shared/components/chart-tooltip';
import Checkbox from 'shared/components/Checkbox';
import ComposedChartWithEmptyState from 'shared/components/ComposedChartWithEmptyState';
import getCN from 'classnames';
import MetricValue from 'cerebro-shared/components/MetricValue';
import PropTypes from 'prop-types';
import React from 'react';
import Trend from 'shared/components/Trend';
import URLConstants from 'shared/util/url-constants';
import {
	ANIMATION_DURATION,
	AXIS,
	getAxisTickText,
	getTextWidth,
	getYAxisLabel
} from 'shared/util/recharts';
import {
	Bar,
	CartesianGrid,
	Cell,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';
import {find, get, last} from 'lodash';
import {formatXAxisDate} from 'shared/util/charts';
import {getDateTitle} from 'shared/util/charts';
import {Map} from 'immutable';
import {RangeKeyTimeRanges} from 'shared/util/constants';
import {toInt} from 'shared/util/numbers';
import {toUnix} from 'shared/util/date';

const CLASSNAME = 'analytics-metrics';
export const CHART_DATA_ID_1 = 'data_1';
export const CHART_DATA_ID_2 = 'data_2';
export const CHART_DATA_PREVIOUS = 'data_previous';
export const METRIC_TOOLTIP_LABEL_MAP = {
	bounceRateMetric: Liferay.Language.get('avg-bounce')
};

/**
 * Tooltip Label Title
 * @param {string} rangeKey
 */
export const tooltipLabelTitle = rangeKey => {
	let label;

	if (
		rangeKey === RangeKeyTimeRanges.Last24Hours ||
		rangeKey === RangeKeyTimeRanges.Yesterday
	) {
		label = Liferay.Language.get('time');
	} else {
		label = Liferay.Language.get('date');
	}

	return label;
};

const getPreviousValueFromCompositeData = (
	compositeData,
	dataName,
	dateKey
) => {
	const data = get(compositeData, dataName);

	if (data) {
		return data.find(val => toUnix(val.key) === dateKey).previousValue;
	}
};

export default class MainMetrics extends React.Component {
	static defaultProps = {
		activeItemIndex: 0,
		chartHeight: 350,
		hoveredLegendItem: null,
		items: [],
		showPrevious: false,
		showTabs: true
	};

	static propTypes = {
		activeItemIndex: PropTypes.number,
		chartHeight: PropTypes.number,
		items: PropTypes.arrayOf(
			PropTypes.shape({
				active: PropTypes.bool,
				content: PropTypes.shape({
					details: PropTypes.shape({
						color: PropTypes.string,
						icon: PropTypes.string,
						label: PropTypes.string
					}),
					name: PropTypes.string,
					title: PropTypes.string,
					type: PropTypes.string,
					value: PropTypes.string
				}),
				data: PropTypes.arrayOf(
					PropTypes.shape({
						color: PropTypes.string,
						data: PropTypes.array,
						id: PropTypes.string.isRequired,
						name: PropTypes.string
					})
				),
				dateKeysIMap: PropTypes.instanceOf(Map),
				format: PropTypes.func,
				intervals: PropTypes.array,
				prevDateKeysIMap: PropTypes.instanceOf(Map)
			})
		),
		onActiveItemIndexChange: PropTypes.func,
		rangeSelectors: PropTypes.object,
		showTabs: PropTypes.bool
	};

	state = {
		hoverIndex: -1
	};

	buildTabs() {
		const {activeItemIndex, items} = this.props;

		return items.map(({content}, index) => {
			const isActiveTab = activeItemIndex === index;

			const {details, title, type, value} = content;

			const {color, icon, label} = details;

			return {
				onClick: isActiveTab ? undefined : this.handleClickTab(index),
				secondaryInfo: (
					<span>
						<span className='primary-content'>
							<MetricValue type={type} value={value} />
						</span>

						{label && (
							<Trend color={color} icon={icon} label={label} />
						)}
					</span>
				),
				tabId: index,
				title
			};
		});
	}

	@autobind
	handleClickTab(index) {
		const {onActiveItemIndexChange} = this.props;

		return () => {
			if (onActiveItemIndexChange) {
				onActiveItemIndexChange(toInt(index));
			}
		};
	}

	getActiveItem() {
		const {activeItemIndex = 0, items = [], showPrevious} = this.props;

		if (items.length === 0) {
			return {
				chartData: [],
				intervals: [],
				timeline: []
			};
		}

		let retVal = items[0];

		if (activeItemIndex >= 0 || activeItemIndex < items.length) {
			retVal = items[activeItemIndex];
		}

		const chartData = retVal.data.slice(0, -1);
		const timeline = last(retVal.data);

		if (!showPrevious && retVal.asymmetricComparison) {
			retVal = {
				...retVal,
				chartData: chartData.map(dataSet => ({
					...dataSet,
					data: dataSet.data.slice(1)
				})),
				intervals: retVal.intervals.slice(1),
				timeline: {data: timeline.data.slice(1), id: timeline.id}
			};

			if (retVal.compositeData) {
				const compositeDataKeys = Object.keys(retVal.compositeData);

				retVal = {
					...retVal,
					compositeData: compositeDataKeys.reduce((acc, val) => {
						acc = {
							...acc,
							[val]: retVal.compositeData[val].slice(1)
						};

						return acc;
					}, {})
				};
			}
		} else if (showPrevious && retVal.asymmetricComparison) {
			retVal = {
				...retVal,
				chartData: chartData.map(dataSet => ({
					...dataSet,
					data:
						dataSet.id !== 'data_previous'
							? [null, ...dataSet.data.slice(1)]
							: dataSet.data
				})),
				timeline
			};
		} else {
			retVal = {
				...retVal,
				chartData,
				timeline
			};
		}

		return retVal;
	}

	renderChart() {
		const {
			props: {
				chartHeight: height,
				interval,
				rangeSelectors,
				showPrevious
			},
			state: {hoveredLegendItem, hoverIndex}
		} = this;

		const {
			chartData,
			compositeContent,
			content: {name, title},
			dateKeysIMap,
			format,
			intervals,
			timeline
		} = this.getActiveItem();

		const dataIds = chartData.map(item => item.id);

		let yAxisWidth = 40;

		const combinedData = timeline.data.map((date, i) =>
			dataIds.reduce(
				(acc, item, j) => {
					acc[item] = chartData[j].data[i];

					const textWidth = getTextWidth(
						format(chartData[j].data[i])
					);

					if (yAxisWidth < textWidth) {
						yAxisWidth = textWidth;
					}

					return acc;
				},
				{
					date,
					dateString: formatXAxisDate(
						date,
						rangeSelectors.rangeKey,
						interval,
						dateKeysIMap
					)
				}
			)
		);

		const barData = chartData.filter(item => item.type === 'bar');

		const lineData = chartData.filter(item => {
			if (!showPrevious && item.id === CHART_DATA_PREVIOUS) {
				return;
			}

			return item.type !== 'bar';
		});

		return (
			<ResponsiveContainer height={height}>
				<ComposedChart data={combinedData}>
					<CartesianGrid
						stroke={AXIS.gridStroke}
						strokeDasharray='3 3'
						vertical={false}
					/>

					<XAxis
						axisLine={{
							stroke: AXIS.borderStroke
						}}
						dataKey='date'
						interval='preserveStart'
						stroke={AXIS.gridStroke}
						tick={getAxisTickText('x', int =>
							formatXAxisDate(
								int,
								rangeSelectors.rangeKey,
								interval,
								dateKeysIMap
							)
						)}
						tickLine={false}
						tickMargin={12}
						ticks={intervals}
					/>

					<XAxis
						axisLine={{
							stroke: AXIS.borderStroke
						}}
						dataKey='date'
						orientation='top'
						stroke={AXIS.gridStroke}
						tick={false}
						tickLine={false}
						xAxisId='top'
					/>

					<YAxis
						axisLine={{
							stroke: AXIS.borderStroke
						}}
						label={getYAxisLabel(
							METRIC_TOOLTIP_LABEL_MAP[name] || title,
							'left',
							yAxisWidth
						)}
						stroke={AXIS.gridStroke}
						tick={getAxisTickText('y', format)}
						tickLine={false}
						width={yAxisWidth}
					/>

					<YAxis
						axisLine={{
							stroke: AXIS.borderStroke
						}}
						orientation='right'
						stroke={AXIS.gridStroke}
						tick={false}
						tickLine={false}
						width={12}
						yAxisId='right'
					/>

					<Tooltip
						content={this.renderTooltip}
						cursor={!intervals.length ? false : true}
					/>

					<Legend
						align='right'
						formatter={(label, {dataKey}) => {
							if (
								compositeContent &&
								dataKey !== 'data_previous'
							) {
								const {dataName} = barData.find(
									({id}) => id === dataKey
								);

								const {value} = compositeContent[dataName];

								return (
									<>
										{`${label}:`}

										<b className='ml-1'>{value}</b>
									</>
								);
							}

							return label;
						}}
						iconSize={8}
						onMouseEnter={({dataKey}) =>
							this.setState({hoveredLegendItem: dataKey})
						}
						onMouseLeave={() =>
							this.setState({hoveredLegendItem: null})
						}
						verticalAlign='bottom'
						wrapperStyle={{
							bottom: 'auto',
							color: AXIS.textColor,
							fontSize: '14px',
							lineHeight: '21px'
						}}
					/>

					{barData.map(item => (
						<Bar
							animationDuration={ANIMATION_DURATION.bar}
							dataKey={item.id}
							fill={item.color}
							fillOpacity={
								hoveredLegendItem === item.id ||
								!hoveredLegendItem
									? 1
									: 0.2
							}
							key={item.id}
							legendType='circle'
							name={item.name}
							onMouseEnter={(e, index) =>
								this.setState({hoverIndex: index})
							}
							onMouseLeave={() => this.setState({hoverIndex: -1})}
							stackId='a'
						>
							{item.data.map((entry, index) => (
								<Cell
									fill={item.color}
									key={`cell-${index}`}
									opacity={index === hoverIndex ? 0.75 : 1}
								/>
							))}
						</Bar>
					))}

					{lineData.map(item => (
						<Line
							animationDuration={ANIMATION_DURATION.line}
							dataKey={item.id}
							dot={false}
							fill={item.color}
							key={item.id}
							legendType='plainline'
							name={item.name}
							onMouseEnter={(e, index) =>
								this.setState({hoverIndex: index})
							}
							onMouseLeave={() => this.setState({hoverIndex: -1})}
							stroke={item.color}
							strokeDasharray={
								item.id === CHART_DATA_PREVIOUS
									? '5 5'
									: undefined
							}
							strokeOpacity={
								hoveredLegendItem === item.id ||
								!hoveredLegendItem
									? 1
									: 0.2
							}
							strokeWidth={2}
							type='linear'
						/>
					))}
				</ComposedChart>
			</ResponsiveContainer>
		);
	}

	@autobind
	renderTooltip({active, payload}) {
		if (!active || !payload || !payload.length) {
			return null;
		}

		const {interval, rangeSelectors, showPrevious} = this.props;

		const dateKey = payload[0].payload.date;

		const {
			asymmetricComparison,
			chartData,
			compositeData,
			content: {name, title},
			dateKeysIMap,
			format,
			prevDateKeysIMap
		} = this.getActiveItem();

		const showCurrentPeriod = asymmetricComparison
			? payload.length > 1
			: true;

		const dataOneItemData = find(
			chartData,
			({id}) => id === CHART_DATA_ID_1
		);
		const dataOneValue = payload[0].value;

		const dataTwoItemData = find(
			chartData,
			({id}) => id === CHART_DATA_ID_2
		);
		const dataTwoValue = payload[1] && payload[1].value;

		const dataPreviousPoint = find(
			payload,
			({dataKey}) => dataKey === CHART_DATA_PREVIOUS
		);

		const dataOnePreviousValue = compositeData
			? getPreviousValueFromCompositeData(
					compositeData,
					get(dataOneItemData, 'dataName'),
					dateKey
			  )
			: get(dataPreviousPoint, 'value');
		const dataTwoPreviousValue = getPreviousValueFromCompositeData(
			compositeData,
			get(dataTwoItemData, 'dataName'),
			dateKey
		);

		const currentPeriodTitle = getDateTitle(
			dateKeysIMap.get(dateKey),
			rangeSelectors.rangeKey,
			interval
		);
		const previousPeriodTitle = getDateTitle(
			prevDateKeysIMap.get(dateKey),
			rangeSelectors.rangeKey,
			interval
		);

		const header = [
			{
				columns: [
					{label: title, weight: 'semibold', width: 116},
					showPrevious && {
						align: 'right',
						label: previousPeriodTitle,
						weight: 'normal',
						width: 55
					},
					showCurrentPeriod && {
						align: 'right',
						label: currentPeriodTitle,
						weight: 'semibold',
						width: 55
					}
				].filter(Boolean)
			}
		];

		const getDataRowName = itemData =>
			get(itemData, 'tooltipTitle') ||
			METRIC_TOOLTIP_LABEL_MAP[name] ||
			get(itemData, 'name');

		const rows = [
			{
				columns: [
					{
						label: getDataRowName(dataOneItemData),
						weight: showPrevious ? 'semibold' : 'normal'
					},
					showPrevious && {
						align: 'right',
						label: format(dataOnePreviousValue)
					},
					showCurrentPeriod && {
						align: 'right',
						label: format(dataOneValue),
						weight: 'semibold'
					}
				].filter(Boolean)
			},
			compositeData && {
				columns: [
					{
						label: getDataRowName(dataTwoItemData),
						weight: showPrevious ? 'semibold' : 'normal'
					},
					showPrevious && {
						align: 'right',
						label: format(dataTwoPreviousValue)
					},
					showCurrentPeriod && {
						align: 'right',
						label: format(dataTwoValue),
						weight: 'semibold'
					}
				].filter(Boolean)
			},
			compositeData && {
				columns: [
					{
						label: Liferay.Language.get('total'),
						weight: showPrevious ? 'semibold' : 'normal'
					},
					showPrevious && {
						align: 'right',
						label: format(
							dataOnePreviousValue + dataTwoPreviousValue
						)
					},
					showCurrentPeriod && {
						align: 'right',
						label: format(dataOneValue + dataTwoValue),
						weight: 'semibold'
					}
				].filter(Boolean)
			}
		].filter(Boolean);

		return (
			<div className='bb-tooltip-container' style={{position: 'static'}}>
				<ChartTooltip header={header} rows={rows} />
			</div>
		);
	}

	render() {
		const {
			activeItemIndex,
			className,
			onShowPreviousChange,
			showPrevious,
			showTabs
		} = this.props;

		const {intervals} = this.getActiveItem();

		return (
			<div className={getCN(CLASSNAME, className)}>
				{showTabs && (
					<CardTabs
						activeTabId={activeItemIndex}
						className='analytics-metrics-tabs'
						tabs={this.buildTabs()}
					/>
				)}

				<div className={`${CLASSNAME}-chart`}>
					<ComposedChartWithEmptyState
						emptyDescription={
							<>
								<span className='mr-1'>
									{Liferay.Language.get(
										'check-back-later-to-verify-if-data-has-been-received-from-your-data-sources'
									)}
								</span>

								<a
									href={
										URLConstants.SitesDashboardSitesActivities
									}
									key='DOCUMENTATION'
									target='_blank'
								>
									{Liferay.Language.get(
										'learn-more-about-site-activity'
									)}
								</a>
							</>
						}
						emptyTitle={Liferay.Language.get(
							'there-is-no-data-for-site-activity'
						)}
						showEmptyState={!intervals.length}
					>
						{this.renderChart()}
					</ComposedChartWithEmptyState>

					<div className={`${CLASSNAME}-chart-sub-content-wrapper`}>
						<Checkbox
							checked={showPrevious}
							label={Liferay.Language.get('compare-to-previous')}
							onChange={() => onShowPreviousChange(!showPrevious)}
						/>
					</div>
				</div>
			</div>
		);
	}
}

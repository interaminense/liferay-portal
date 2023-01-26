import * as API from 'shared/api';
import autobind from 'autobind-decorator';
import Button from 'shared/components/Button';
import Card from 'shared/components/Card';
import ChartTooltip from 'shared/components/chart-tooltip';
import ComposedChartWithEmptyState from 'shared/components/ComposedChartWithEmptyState';
import getCN from 'classnames';
import NoResultsDisplay from 'shared/components/NoResultsDisplay';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import SearchableEntityTable from 'shared/components/SearchableEntityTable';
import URLConstants from 'shared/util/url-constants';
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ReferenceDot,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';
import {
	AXIS,
	getAxisTickText,
	getYAxisLabel,
	getYAxisWidth
} from 'shared/util/recharts';
import {
	changesListColumns,
	individualsListColumns
} from 'shared/util/table-columns';
import {CHART_COLOR_NAMES} from 'shared/components/Chart';
import {compose} from 'redux';
import {createDateKeysIMap} from 'shared/util/intervals';
import {DATE_CHANGED, NAME} from 'shared/util/pagination';
import {formatUTCDateFromUnix} from 'shared/util/date';
import {formatXAxisDate, getIntervals} from 'shared/util/charts';
import {get, isNil} from 'lodash';
import {getNetChange} from 'shared/util/change';
import {INDIVIDUALS} from 'shared/util/router';
import {OrderByDirections, RangeKeyTimeRanges} from 'shared/util/constants';
import {OrderedMap} from 'immutable';
import {OrderParams} from 'shared/util/records';
import {sub} from 'shared/util/lang';
import {useStatefulPagination} from 'shared/hooks';
import {withSelectedPoint} from 'shared/hoc';

const {mormont: CHART_ORANGE, stark: CHART_BLUE} = CHART_COLOR_NAMES;

const INTERVAL = 'D';

const CHANGES_AGGREGATION_SHAPE = PropTypes.arrayOf(
	PropTypes.shape({
		added: PropTypes.number,
		anonymousCount: PropTypes.number,
		knownCount: PropTypes.number,
		modifiedDate: PropTypes.number,
		removed: PropTypes.number,
		value: PropTypes.number
	})
).isRequired;

function getAllMembers(data) {
	const {channelId, delta, groupId, id, orderIOMap, page, query} = data;

	return API.individuals.search({
		channelId,
		delta,
		groupId,
		individualSegmentId: id,
		orderIOMap,
		page,
		query
	});
}

function getMemberChanges(data) {
	const {delta, groupId, id, modifiedDate, orderIOMap, page, query} = data;

	return API.individualSegment.fetchMembershipChanges({
		cur: page,
		delta,
		endDate: modifiedDate,
		groupId,
		id,
		orderIOMap,
		query,
		startDate: modifiedDate
	});
}

export class SegmentGrowthChart extends React.Component {
	static defaultProps = {
		alwaysShowSelectedTooltip: false,
		height: 360,
		individualCounts: {
			anonymousCount: 0,
			knownCount: 0
		}
	};

	static propTypes = {
		alwaysShowSelectedTooltip: PropTypes.bool,
		data: CHANGES_AGGREGATION_SHAPE,
		hasSelectedPoint: PropTypes.bool,
		height: PropTypes.number,
		individualCounts: PropTypes.shape({
			anonymousCount: PropTypes.number,
			knownCount: PropTypes.number
		}),
		onPointSelect: PropTypes.func,
		selectedPoint: PropTypes.number
	};

	state = {
		legendHoverItem: null,
		mouseOutside: false,
		selectedTooltipX: null
	};

	constructor(props) {
		super(props);

		this._tooltipRef = React.createRef();
	}

	@autobind
	renderTooltip({active, payload}) {
		const {data, hasSelectedPoint, selectedPoint} = this.props;

		if ((active && payload && !!payload.length) || hasSelectedPoint) {
			const {
				added,
				anonymousCount,
				knownCount,
				modifiedDate,
				removed,
				value
			} = get(payload, [0, 'payload'], data[selectedPoint]);

			const change = [
				{
					label: Liferay.Language.get('added'),
					value: added
				},
				{
					label: Liferay.Language.get('removed'),
					value: removed
				}
			];

			const index = data.findIndex(
				item => item.modifiedDate === modifiedDate
			);

			const netChange = getNetChange(
				get(data[index - 1], 'value'),
				value
			);

			return (
				<div
					className='bb-tooltip-container'
					style={{position: 'static'}}
				>
					<ChartTooltip
						header={[
							{
								label: sub(
									Liferay.Language.get('as-of-x'),
									[formatUTCDateFromUnix(modifiedDate, 'll')],
									false
								),
								weight: 'semibold'
							},
							{
								className: 'pb-0',
								label: (
									<span className='text-secondary'>
										{sub(
											Liferay.Language.get(
												'x-total-members'
											),
											[
												<b className='mr-1' key='VALUE'>
													{value.toLocaleString()}
												</b>
											],
											false
										)}
									</span>
								)
							},
							{
								className: 'pb-0',
								label: (
									<span className='text-secondary'>
										{sub(
											Liferay.Language.get(
												'x-anonymous-members'
											),
											[
												<b className='mr-1' key='VALUE'>
													{anonymousCount.toLocaleString()}
												</b>
											],
											false
										)}
									</span>
								)
							},
							{
								label: (
									<span className='text-secondary'>
										{sub(
											Liferay.Language.get(
												'x-known-members'
											),
											[
												<b className='mr-1' key='VALUE'>
													{knownCount.toLocaleString()}
												</b>
											],
											false
										)}
									</span>
								)
							}
						].map(column => ({
							columns: [column]
						}))}
						rows={(isNil(netChange)
							? change
							: [
									...change,
									{
										label: Liferay.Language.get(
											'net-change'
										),
										value: `${netChange[0]}(${netChange[1]}%)`
									}
							  ]
						).map(({label, value}, i, array) => {
							const className =
								i < array.length - 1 ? 'pb-0' : null;

							return {
								columns: [
									{
										className,
										label,
										weight: 'normal'
									},
									{
										align: 'right',
										className,
										label: value,
										weight: 'semibold'
									}
								]
							};
						})}
					/>
				</div>
			);
		}
	}

	render() {
		const {
			props: {
				alwaysShowSelectedTooltip,
				data,
				hasSelectedPoint,
				height,
				individualCounts: {anonymousCount, knownCount},
				onPointSelect,
				selectedPoint
			},
			state: {legendHoverItem, mouseOutside, selectedTooltipX}
		} = this;

		const commonAreaChartStyles = {
			isAnimationActive: true,
			legendType: 'circle',
			stackId: 'count'
		};

		const showFixedTooltip = hasSelectedPoint && mouseOutside;

		const dateKeysIMap = createDateKeysIMap(INTERVAL, data, 'modifiedDate');

		const intervals = getIntervals(
			RangeKeyTimeRanges.Last30Days,
			data.map(({modifiedDate}) => modifiedDate),
			INTERVAL,
			dateKeysIMap
		);

		const yAxisWidth = getYAxisWidth(data, 'value');

		return (
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
								URLConstants.SegmentsOverviewTabDocumentationLink
							}
							key='DOCUMENTATION'
							target='_blank'
						>
							{Liferay.Language.get(
								'learn-more-about-segment-membership'
							)}
						</a>
					</>
				}
				emptyTitle={Liferay.Language.get(
					'there-is-no-data-for-segment-membership'
				)}
				showEmptyState={!intervals.length}
			>
				<ResponsiveContainer height={height}>
					<AreaChart
						data={data}
						onClick={pointData => {
							if (alwaysShowSelectedTooltip && pointData) {
								if (this._tooltipRef) {
									const {
										getTranslate,
										props: {viewBox},
										state: {boxWidth}
									} = this._tooltipRef.current;

									this.setState({
										selectedTooltipX: getTranslate({
											key: 'x',
											tooltipDimension: boxWidth,
											viewBoxDimension: viewBox.width
										})
									});
								}

								onPointSelect({
									index: pointData.activeTooltipIndex
								});
							}
						}}
						onMouseLeave={() => this.setState({mouseOutside: true})}
						onMouseMove={() => this.setState({mouseOutside: false})}
					>
						<CartesianGrid
							stroke={AXIS.gridStroke}
							strokeDasharray='3 3'
							vertical={false}
						/>

						<XAxis
							axisLine={{stroke: AXIS.borderStroke}}
							dataKey='modifiedDate'
							domain={['dataMin', 'dataMax']}
							interval='preserveStart'
							padding={{left: 20, right: 20}}
							tick={getAxisTickText('x', value =>
								formatXAxisDate(
									value,
									RangeKeyTimeRanges.Last30Days,
									INTERVAL,
									dateKeysIMap
								)
							)}
							tickLine={false}
							tickMargin={12}
							ticks={intervals}
						/>

						<XAxis
							axisLine={{stroke: AXIS.borderStroke}}
							dataKey='modifiedDate'
							orientation='top'
							stroke={AXIS.gridStroke}
							tick={false}
							tickLine={false}
							xAxisId='top'
						/>

						<YAxis
							allowDecimals={false}
							axisLine={{stroke: AXIS.borderStroke}}
							label={getYAxisLabel(
								Liferay.Language.get('membership'),
								'left',
								yAxisWidth
							)}
							name={Liferay.Language.get('membership')}
							stroke={AXIS.gridStroke}
							tick={getAxisTickText('y')}
							tickCount={6}
							tickLine={false}
							type='number'
							width={yAxisWidth}
						/>

						<YAxis
							axisLine={{stroke: AXIS.borderStroke}}
							orientation='right'
							stroke={AXIS.gridStroke}
							tick={false}
							tickLine={false}
							type='number'
							width={1}
							yAxisId='right'
						/>

						<Legend
							align='left'
							formatter={(value, {count}) => (
								<span>
									{`${value}:`}

									<b className='ml-1'>{count}</b>
								</span>
							)}
							iconSize={8}
							onMouseEnter={({dataKey}) =>
								this.setState({legendHoverItem: dataKey})
							}
							onMouseLeave={() =>
								this.setState({legendHoverItem: null})
							}
							payload={[
								{
									color: CHART_BLUE,
									count: knownCount,
									dataKey: 'knownCount',
									type: 'circle',
									value: Liferay.Language.get('known-members')
								},
								{
									color: CHART_ORANGE,
									count: anonymousCount,
									dataKey: 'anonymousCount',
									type: 'circle',
									value: Liferay.Language.get(
										'anonymous-members'
									)
								},
								{
									color: 'rgba(0,0,0,0)',
									count: anonymousCount + knownCount,
									dataKey: 'individualCount',
									type: 'circle',
									value: Liferay.Language.get('total-members')
								}
							]}
							verticalAlign='top'
							wrapperStyle={{
								color: AXIS.textColor,
								fontSize: '14px',
								lineHeight: '21px',
								paddingBottom: '22px'
							}}
						/>

						<Tooltip
							content={this.renderTooltip}
							cursor={!intervals.length ? false : true}
							position={
								showFixedTooltip
									? {
											x: selectedTooltipX
									  }
									: null
							}
							ref={this._tooltipRef}
							wrapperStyle={
								showFixedTooltip
									? {
											visibility: 'visible'
									  }
									: null
							}
						/>

						<ReferenceLine
							strokeWidth={1}
							x={
								showFixedTooltip
									? data[selectedPoint].modifiedDate
									: null
							}
						/>

						<ReferenceDot
							fill={CHART_BLUE}
							fillOpacity={
								legendHoverItem === 'anonymousCount' ? 0.1 : 1
							}
							isFront
							r={4}
							stroke='none'
							x={
								hasSelectedPoint
									? data[selectedPoint].modifiedDate
									: null
							}
							y={
								hasSelectedPoint
									? data[selectedPoint].knownCount
									: null
							}
						/>

						<ReferenceDot
							fill={CHART_ORANGE}
							fillOpacity={
								legendHoverItem === 'knownCount' ? 0.1 : 1
							}
							isFront
							r={4}
							stroke='none'
							x={
								hasSelectedPoint
									? data[selectedPoint].modifiedDate
									: null
							}
							y={
								hasSelectedPoint
									? data[selectedPoint].knownCount +
									  data[selectedPoint].anonymousCount
									: null
							}
						/>

						<Area
							{...commonAreaChartStyles}
							activeDot={{r: 4, stroke: CHART_BLUE}}
							dataKey='knownCount'
							fill={CHART_BLUE}
							fillOpacity={
								legendHoverItem === 'anonymousCount' ? 0.1 : 0.2
							}
							isAnimationActive={false}
							name={Liferay.Language.get('known-members')}
							stroke={CHART_BLUE}
							strokeOpacity={
								legendHoverItem === 'anonymousCount' ? 0.2 : 1
							}
						/>

						<Area
							{...commonAreaChartStyles}
							activeDot={{r: 4, stroke: CHART_ORANGE}}
							dataKey='anonymousCount'
							fill={CHART_ORANGE}
							fillOpacity={
								legendHoverItem === 'knownCount' ? 0.1 : 0.2
							}
							isAnimationActive={false}
							name={Liferay.Language.get('anonymous-members')}
							stroke={CHART_ORANGE}
							strokeOpacity={
								legendHoverItem === 'knownCount' ? 0.2 : 1
							}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</ComposedChartWithEmptyState>
		);
	}
}

export class SelectedPointInfo extends React.Component {
	static propTypes = {
		data: CHANGES_AGGREGATION_SHAPE,
		hasSelectedPoint: PropTypes.bool,
		onClearSelection: PropTypes.func.isRequired,
		selectedPoint: PropTypes.number
	};

	render() {
		const {
			data,
			hasSelectedPoint,
			onClearSelection,
			selectedPoint
		} = this.props;

		const {added, modifiedDate, removed} = get(data, selectedPoint, {});

		const changeValues =
			hasSelectedPoint &&
			selectedPoint > 0 &&
			getNetChange(data[selectedPoint - 1], data[selectedPoint]);

		return (
			<div className='selected-point-info'>
				{hasSelectedPoint ? (
					<>
						<div className='d-flex align-items-baseline'>
							<h4>
								{sub(
									Liferay.Language.get(
										'segment-membership-activities-x'
									),
									[formatUTCDateFromUnix(modifiedDate)]
								)}
							</h4>

							<Button
								display='link'
								onClick={onClearSelection}
								size='sm'
							>
								{Liferay.Language.get('clear-date-selection')}
							</Button>
						</div>

						<div className='changed-values'>
							{sub(
								Liferay.Language.get('added-x'),
								[<b key='ADDED'>{added}</b>],
								false
							)}

							{sub(
								Liferay.Language.get('removed-x'),
								[<b key='REMOVED'>{removed}</b>],
								false
							)}

							{changeValues &&
								sub(
									Liferay.Language.get('net-change-x'),
									[
										<b key='CHANGE'>
											{`${changeValues[0]}(${changeValues[1]}%)`}
										</b>
									],
									false
								)}
						</div>
					</>
				) : (
					<h4>{Liferay.Language.get('known-members')}</h4>
				)}
			</div>
		);
	}
}

const SegmentGrowthWithList = ({
	channelId,
	className,
	data,
	groupId,
	hasSelectedPoint,
	id,
	individualCounts,
	onPointSelect,
	selectedPoint,
	timeZoneId
}) => {
	const [showMembershipList, setShowMembershipList] = useState(true);

	const fetchMembers = params => {
		const fetchMembersFn = hasSelectedPoint
			? getMemberChanges
			: getAllMembers;

		return fetchMembersFn(params);
	};

	const getColumns = () => {
		if (hasSelectedPoint) {
			return [
				changesListColumns.getIndividualName({channelId, groupId}),
				changesListColumns.individualEmail,
				individualsListColumns.accountNames,
				changesListColumns.getDateFirst(timeZoneId),
				changesListColumns.getOperation(timeZoneId)
			];
		}

		return [
			individualsListColumns.getName({channelId, groupId}),
			individualsListColumns.email,
			individualsListColumns.accountNames,
			individualsListColumns.getDateCreated(timeZoneId)
		];
	};

	const handleClearSelection = () => {
		onPointSelect({index: null});
	};

	const {modifiedDate} = get(data, selectedPoint, {});

	const paginationParams = useStatefulPagination(null, {
		initialDelta: 20,
		initialOrderIOMap: hasSelectedPoint
			? OrderedMap({
					[DATE_CHANGED]: new OrderParams({
						field: DATE_CHANGED,
						sortOrder: OrderByDirections.Descending
					})
			  })
			: OrderedMap({
					[NAME]: new OrderParams({
						field: NAME,
						sortOrder: OrderByDirections.Ascending
					})
			  }),
		initialPage: 0
	});

	const dateKeysIMap = createDateKeysIMap(INTERVAL, data, 'modifiedDate');

	const intervals = getIntervals(
		RangeKeyTimeRanges.Last30Days,
		data.map(({modifiedDate}) => modifiedDate),
		INTERVAL,
		dateKeysIMap
	);

	return (
		<Card.Body
			className={getCN('segment-growth-root', className)}
			noPadding
		>
			<div className='segment-growth-chart-container'>
				<SegmentGrowthChart
					alwaysShowSelectedTooltip
					data={data}
					hasSelectedPoint={hasSelectedPoint}
					individualCounts={individualCounts}
					onPointSelect={onPointSelect}
					selectedPoint={selectedPoint}
				/>
			</div>

			{showMembershipList && (
				<>
					<SelectedPointInfo
						data={data}
						hasSelectedPoint={hasSelectedPoint}
						onClearSelection={handleClearSelection}
						selectedPoint={selectedPoint}
					/>

					<SearchableEntityTable
						{...paginationParams}
						columns={getColumns()}
						dataSourceFn={fetchMembers}
						dataSourceParams={{
							channelId,
							groupId,
							id,
							modifiedDate
						}}
						entityType={INDIVIDUALS}
						noResultsRenderer={() => {
							// Check if intervals exists after fetch members
							// to show/hide membership list based on intervals of chart
							// to avoid render two empty states
							setShowMembershipList(!!intervals.length);

							return (
								<NoResultsDisplay
									description={
										<>
											<span className='mr-1'>
												{Liferay.Language.get(
													'check-back-later-to-verify-if-data-has-been-received-from-your-data-sources'
												)}
											</span>

											<a
												href={
													URLConstants.SegmentsMembershipDocumentationLink
												}
												key='DOCUMENTATION'
												target='_blank'
											>
												{Liferay.Language.get(
													'learn-more-about-individuals'
												)}
											</a>
										</>
									}
									spacer
									title={Liferay.Language.get(
										'there-are-no-members-found-on-the-selected-time-period'
									)}
								/>
							);
						}}
						rowIdentifier='id'
					/>
				</>
			)}
		</Card.Body>
	);
};

export default compose(withSelectedPoint)(SegmentGrowthWithList);

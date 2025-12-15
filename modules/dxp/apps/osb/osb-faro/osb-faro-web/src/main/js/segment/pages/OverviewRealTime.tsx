import Button from '@clayui/button';
import Card from 'shared/components/Card';
import CriteriaCard from 'segment/components/criteria-card';
import Loading from 'shared/components/Loading';
import React, {useMemo, useState} from 'react';
import {fetchMembershipChangesAggregations} from 'shared/api/individual-segment';
import {formatUTCDate} from 'shared/util/date';
import {ReferencedObjectsProvider} from 'segment/segment-editor/dynamic/context/referencedObjects';
import {Segment} from 'shared/util/records';
import {SegmentGrowthChart} from 'segment/components/Growth';
import {SegmentTypes} from 'shared/util/constants';
import {useRequest} from 'shared/hooks/useRequest';
import {useTimeZone} from 'shared/hooks/useTimeZone';
import SearchableEntityTable from 'shared/components/SearchableEntityTable';

interface IOverviewProps {
	channelId: string;
	groupId: string;
	segment: Segment;
}

const SelectedPointInfo = ({dateRange, hasSelectedPoint, setSelectedPoint}) => (
	<div>
		<div className='selected-point-info'>
			<div className='h4'>
				{hasSelectedPoint ? 'Members on: ' : 'Members from: '}
				{dateRange}
				{hasSelectedPoint ? (
					<Button
						className=''
						displayType='link'
						onClick={() => setSelectedPoint(0)}
					>
						{'Clear Date Selection'}
					</Button>
				) : null}
			</div>
		</div>
	</div>
);

const RealTimeSegmentOverview: React.FC<IOverviewProps> = ({
	channelId,
	groupId,
	segment
}) => {
	const {criteriaString, id, includeAnonymousUsers} = segment;

	const {timeZoneId} = useTimeZone();

	const {data, loading} = useRequest({
		dataSourceFn: fetchMembershipChangesAggregations,
		variables: {channelId, groupId, id, interval: 'day', max: 30}
	});

	const [selectedPoint, setSelectedPoint] = useState(0);

	const dateRange = useMemo(() => {
		if (data) {
			if (selectedPoint) {
				return `${formatUTCDate(data[selectedPoint].intervalInitDate)}`;
			}

			return `${formatUTCDate(
				data[0].intervalInitDate
			)} - ${formatUTCDate(data[data.length - 1].intervalInitDate)}`;
		}
	}, [data, selectedPoint, selectedPoint]);

	return (
		<div>
			<ReferencedObjectsProvider segment={segment}>
				<CriteriaCard
					criteriaString={criteriaString}
					includeAnonymousUsers={includeAnonymousUsers}
					segmentType={SegmentTypes.RealTime}
					timeZoneId={timeZoneId}
				/>
			</ReferencedObjectsProvider>

			<Card>
				<Card.Header>
					<Card.Title>
						{Liferay.Language.get('segment-membership-trend')}
					</Card.Title>
				</Card.Header>

				<Card.Body className='segment-growth-root' noPadding>
					{loading ? (
						<Loading />
					) : (
						<>
							<div className='segment-growth-chart-container'>
								<SegmentGrowthChart
									alwaysShowSelectedTooltip
									data={data.map(item => ({
										added: item.addedIndividualsCount,
										anonymousCount:
											item.anonymousIndividualsCount,
										knownCount: item.knownIndividualsCount,
										modifiedDate: item.intervalInitDate,
										removed: item.removedIndividualsCount,
										value: item.individualsCount
									}))}
									hasSelectedPoint
									height={360}
									individualCounts={{
										anonymousCount: 0,
										knownCount: 0
									}}
									selectedPoint={selectedPoint}
									setSelectedPoint={setSelectedPoint}
								/>
							</div>
							<SelectedPointInfo
								dateRange={dateRange}
								hasSelectedPoint={!!selectedPoint}
								setSelectedPoint={setSelectedPoint}
							/>
							{/* <SearchableEntityTable /> */}
						</>
					)}
				</Card.Body>
			</Card>
		</div>
	);
};

export default RealTimeSegmentOverview;

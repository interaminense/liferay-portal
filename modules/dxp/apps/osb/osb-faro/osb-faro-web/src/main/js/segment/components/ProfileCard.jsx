import * as API from 'shared/api';
import Button from 'shared/components/Button';
import Card from 'shared/components/Card';
import React from 'react';
import {mapGrowthHistory} from 'shared/hoc/mappers/segment';
import {PropTypes} from 'prop-types';
import {Routes, toRoute} from 'shared/util/router';
import {Segment} from 'shared/util/records';
import {SegmentGrowthChart} from './Growth';
import {withRequest} from 'shared/hoc';

export const MembershipChart = withRequest(
	API.individualSegment.fetchMembershipChangesAggregations,
	mapGrowthHistory,
	{
		page: false
	}
)(
	class extends React.Component {
		static propTypes = {
			data: PropTypes.array,
			groupId: PropTypes.string.isRequired,
			id: PropTypes.string.isRequired,
			individualCounts: PropTypes.shape({
				anonymousCount: PropTypes.number,
				knownCount: PropTypes.number
			})
		};

		render() {
			const {data, groupId, id, individualCounts} = this.props;

			return (
				<SegmentGrowthChart
					data={data}
					groupId={groupId}
					id={id}
					individualCounts={individualCounts}
				/>
			);
		}
	}
);

export class SegmentProfileCard extends React.Component {
	static propTypes = {
		channelId: PropTypes.string,
		groupId: PropTypes.string.isRequired,
		id: PropTypes.string.isRequired,
		individualCounts: PropTypes.shape({
			anonymousCount: PropTypes.number,
			knownCount: PropTypes.number
		}),
		segment: PropTypes.instanceOf(Segment).isRequired
	};

	render() {
		const {
			channelId,
			groupId,
			segment: {anonymousIndividualCount, id, knownIndividualCount}
		} = this.props;

		return (
			<Card className='segment-profile-card-root'>
				<Card.Header>
					<Card.Title>
						{Liferay.Language.get('segment-membership')}
					</Card.Title>

					<div className='subtitle-segment'>
						{Liferay.Language.get(
							'segment-membership-processes-daily-and-does-not-include-todays-activities'
						)}
					</div>
				</Card.Header>

				<Card.Body>
					<MembershipChart
						channelId={channelId}
						groupId={groupId}
						id={id}
						individualCounts={{
							anonymousCount: anonymousIndividualCount,
							knownCount: knownIndividualCount
						}}
					/>
				</Card.Body>

				<Card.Footer>
					<Button
						display='link'
						href={toRoute(Routes.CONTACTS_SEGMENT_MEMBERSHIP, {
							channelId,
							groupId,
							id
						})}
						icon='angle-right'
						iconAlignment='right'
						size='sm'
					>
						{Liferay.Language.get('view-members')}
					</Button>
				</Card.Footer>
			</Card>
		);
	}
}

export default SegmentProfileCard;

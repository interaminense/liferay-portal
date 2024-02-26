import * as API from 'shared/api';
import AssociatedSegmentsList from 'contacts/components/AssociatedSegmentsList';
import ClayLink from '@clayui/link';
import NoResultsDisplay from 'shared/components/NoResultsDisplay';
import React, {useState} from 'react';
import URLConstants from 'shared/util/url-constants';
import {
	createOrderIOMap,
	getDefaultSortOrder,
	NAME
} from 'shared/util/pagination';
import {EntityTypes, Sizes} from 'shared/util/constants';
import {useParams} from 'react-router-dom';
import {useQueryPagination} from 'shared/hooks/useQueryPagination';
import {useTimeZone} from 'shared/hooks/useTimeZone';

const fetchAssociatedSegments = ({
	delta,
	groupId,
	id,
	orderIOMap,
	page,
	query,
	...otherParams
}) =>
	API.individualSegment.search({
		contactsEntityId: id,
		contactsEntityType: EntityTypes.Account,
		delta,
		groupId,
		orderIOMap,
		page,
		query,
		...otherParams
	});

interface IAssociatedSegmentsProps {
	id: string;
}

const AssociatedSegments: React.FC<IAssociatedSegmentsProps> = ({id}) => {
	const {channelId, groupId} = useParams();
	const {timeZoneId} = useTimeZone();
	const {delta, orderIOMap, page, query} = useQueryPagination({
		initialOrderIOMap: createOrderIOMap(NAME, getDefaultSortOrder(NAME))
	});

	const [total, setTotal] = useState<number>(0);

	const segmentsDataSourceFn = dataSourceParams =>
		fetchAssociatedSegments({channelId, ...dataSourceParams}).then(
			response => {
				setTotal(response.total);

				return response;
			}
		);

	return (
		<AssociatedSegmentsList
			channelId={channelId}
			dataSourceFn={segmentsDataSourceFn}
			delta={delta}
			groupId={groupId}
			id={id}
			noResultsRenderer={() => (
				<NoResultsDisplay
					description={
						<>
							{Liferay.Language.get(
								'create-a-segment-to-get-started'
							)}

							<ClayLink
								className='d-block'
								href={URLConstants.SegmentsDocumentationLink}
								key='DOCUMENTATION'
								target='_blank'
							>
								{Liferay.Language.get(
									'learn-more-about-segments'
								)}
							</ClayLink>
						</>
					}
					icon={{
						border: false,
						size: Sizes.XXXLarge,
						symbol: 'ac-satellite'
					}}
					title={Liferay.Language.get('there-are-no-segments-found')}
				/>
			)}
			orderIOMap={orderIOMap}
			page={page}
			query={query}
			timeZoneId={timeZoneId}
			total={total}
		/>
	);
};

export default AssociatedSegments;

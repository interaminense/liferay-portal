import * as API from 'shared/api';
import React, {useEffect, useState} from 'react';
import {matchPath, useNavigate, useParams} from 'react-router';
import {Routes, toRoute} from 'shared/util/router';
import {WrapSafeResults} from 'shared/hoc/util';

const checkSegmentLink = WrappedComponent => props => {
	const {groupId} = useParams();
	const navigate = useNavigate();
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const segment = matchPath<any, any>(
			Routes.CONTACTS_SEGMENT,
			location.pathname
		);

		if (segment && !segment.params.channelId) {
			setLoading(true);

			API.individualSegment
				.fetch({groupId, segmentId: segment.params.id})
				.then(({channelId, id}) => {
					setLoading(false);

					navigate(
						toRoute(Routes.CONTACTS_SEGMENT, {
							channelId,
							groupId,
							id
						}),
						{replace: true}
					);
				})
				.catch(err => {
					setLoading(false);
					setError(err);
				});
		}
	}, []);

	return (
		<WrapSafeResults error={error} loading={loading} page pageDisplay>
			<WrappedComponent
				{...props}
				groupId={groupId}
				location={location}
				navigate={navigate}
			/>
		</WrapSafeResults>
	);
};

export default checkSegmentLink;

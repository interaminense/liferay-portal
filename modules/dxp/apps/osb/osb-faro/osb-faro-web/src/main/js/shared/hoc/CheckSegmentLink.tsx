import * as API from 'shared/api';
import React, {useEffect, useState} from 'react';
import {matchPath, useHistory, useLocation} from 'react-router-dom';
import {Routes, toRoute} from 'shared/util/router';
import {WrapSafeResults} from 'shared/hoc/util';

interface IWrappedComponentProps {
	groupId: string;
}

const checkSegmentLink =
	(WrappedComponent: React.ComponentType<IWrappedComponentProps>) =>
	({
		groupId,
		...otherProps
	}: IWrappedComponentProps & {[key: string]: any}) => {
		const history = useHistory();
		const location = useLocation();

		const [error, setError] = useState();
		const [loading, setLoading] = useState(false);

		useEffect(() => {
			const segment = matchPath<{channelId: string; id: string}>(
				location.pathname,
				{
					exact: true,
					path: Routes.CONTACTS_SEGMENT
				}
			);

			if (segment && !segment.params.channelId) {
				setLoading(true);

				API.individualSegment
					.fetch({groupId, segmentId: segment.params.id})
					.then(({channelId, id}) => {
						setLoading(false);

						history.replace(
							toRoute(Routes.CONTACTS_SEGMENT, {
								channelId,
								groupId,
								id
							})
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
				<WrappedComponent {...otherProps} groupId={groupId} />
			</WrapSafeResults>
		);
	};

export default checkSegmentLink;

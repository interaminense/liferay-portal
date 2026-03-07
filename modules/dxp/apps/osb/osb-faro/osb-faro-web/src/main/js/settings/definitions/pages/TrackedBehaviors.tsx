import BasePage from 'settings/components/base-page/BasePage';
import React from 'react';
import TrackedBehaviorsList from '../hocs/TrackedBehaviorsList';
import {getDefinitions} from 'shared/util/breadcrumbs';
import {useCurrentUser} from 'shared/hooks/useCurrentUser';
import {useParams} from 'react-router';

export const TrackedBehaviors = () => {
	const {groupId} = useParams();
	const currentUser = useCurrentUser();

	return (
		<BasePage
			breadcrumbItems={[
				getDefinitions({groupId}),
				{active: true, label: Liferay.Language.get('behaviors')}
			]}
			pageDescription={Liferay.Language.get(
				'this-is-the-data-model-of-behaviors-tracked-within-analytics-cloud.-instructions-for-tracking-third-party-assets-in-analytics-cloud-are-provided-when-you-click-each-behavior.-click-and-conversion-goals-can-be-tracked-using-click-events'
			)}
			pageTitle={Liferay.Language.get('tracked-behaviors')}
		>
			<TrackedBehaviorsList authorized={currentUser.isAdmin()} />
		</BasePage>
	);
};

export default TrackedBehaviors;

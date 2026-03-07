import BasePage from 'settings/components/base-page/BasePage';
import React from 'react';
import SuppressedUserList from '../hocs/SuppressedUserList';
import {getDataPrivacy} from 'shared/util/breadcrumbs';
import {useCurrentUser} from 'shared/hooks/useCurrentUser';
import {useTimeZone} from 'shared/hooks/useTimeZone';
import {useParams} from 'react-router';

export const SuppressedUsers = () => {
	const params = useParams();
	const currentUser = useCurrentUser();
	const {timeZoneId} = useTimeZone();

	return (
		<BasePage
			breadcrumbItems={[
				getDataPrivacy({groupId: params.groupId}),
				{
					active: true,
					label: Liferay.Language.get('suppressed-user-list')
				}
			]}
			className='suppressed-users-page-root'
			documentTitle={Liferay.Language.get('suppressed-user-list')}
		>
			<SuppressedUserList
				currentUser={currentUser}
				router={{params}}
				timeZoneId={timeZoneId}
			/>
		</BasePage>
	);
};

export default SuppressedUsers;

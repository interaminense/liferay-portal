import BasePage from 'settings/components/BasePage';
import React from 'react';
import RequestList from '../hocs/RequestList';
import {getDataPrivacy} from 'shared/util/breadcrumbs';
import {useParams} from 'react-router-dom';

export const RequestLog = () => {
	const {groupId} = useParams();

	return (
		<BasePage
			breadcrumbItems={[
				getDataPrivacy({groupId}),
				{
					active: true,
					label: Liferay.Language.get('request-log')
				}
			]}
			className='request-log-page-root'
			documentTitle={Liferay.Language.get('request-log')}
			groupId={groupId}
		>
			<RequestList />
		</BasePage>
	);
};

export default RequestLog;

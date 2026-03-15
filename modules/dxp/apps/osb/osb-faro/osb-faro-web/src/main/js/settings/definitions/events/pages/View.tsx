import BasePage from 'settings/components/base-page/BasePage';
import EVENT_DEFINITION_QUERY, {
	EventDefinitionData,
	EventDefinitionVariables,
	UPDATE_EVENT_DEFINITION
} from 'event-analysis/queries/EventDefinitionQuery';
import EventDetailsCard from '../components/EventDetailsCard';
import React from 'react';
import {close, modalTypes, open} from 'shared/actions/modals';
import {connect} from 'react-redux';
import {Event} from 'event-analysis/utils/types';
import {getDefinitions, getEvents} from 'shared/util/breadcrumbs';
import {HasModal, Modal} from 'shared/types';
import {SafeResults} from 'shared/hoc/util';
import {useParams} from 'react-router';
import {useQuery} from '@apollo/client/react';

interface IViewProps extends React.HTMLAttributes<HTMLElement>, HasModal {
	close: Modal.close;
	open: Modal.open;
}

const View: React.FC<IViewProps> = ({close, open}) => {
	const {eventId, groupId} = useParams();

	const result = useQuery<EventDefinitionData, EventDefinitionVariables>(
		EVENT_DEFINITION_QUERY,
		{
			variables: {id: eventId}
		}
	);

	const viewEventPageActions = [
		{
			label: Liferay.Language.get('edit'),
			onClick: () =>
				open(modalTypes.EDIT_ATTRIBUTE_EVENT_MODAL, {
					id: eventId,
					mutation: UPDATE_EVENT_DEFINITION,
					onClose: close,
					query: EVENT_DEFINITION_QUERY
				})
		}
	];

	return (
		<SafeResults {...result}>
			{({
				eventDefinition: {
					description,
					displayName,
					eventAttributeDefinitions,
					name
				}
			}: {
				eventDefinition: Event;
			}) => (
				<BasePage
					breadcrumbItems={[
						getDefinitions({groupId}),
						getEvents({groupId}),
						{active: true, label: displayName || name}
					]}
					pageActions={viewEventPageActions}
					pageDescription={
						description || Liferay.Language.get('no-description')
					}
					pageTitle={name}
					subTitle={displayName}
				>
					<EventDetailsCard
						eventAttributes={eventAttributeDefinitions}
						eventName={name}
						groupId={groupId}
					/>
				</BasePage>
			)}
		</SafeResults>
	);
};

export default connect(null, {close, open})(View);

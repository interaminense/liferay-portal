import BasePage from 'settings/components/BasePage';
import EVENT_DEFINITION_QUERY, {
	EventDefinitionData,
	EventDefinitionVariables,
	UPDATE_EVENT_DEFINITION
} from 'event-analysis/queries/EventDefinitionQuery';
import EventDetailsCard from '../components/EventDetailsCard';
import React from 'react';
import {Event} from 'event-analysis/utils/types';
import {getDefinitions, getEvents} from 'shared/util/breadcrumbs';
import {Modal} from 'shared/types/Modal';
import {SafeResults} from 'shared/hoc/util';
import {useModal} from 'shared/hooks/useModal';
import {useParams} from 'react-router-dom';
import {useQuery} from '@apollo/react-hooks';

interface IViewProps {
	eventId: string;
}

const View: React.FC<IViewProps> = ({eventId}) => {
	const {close, open} = useModal();
	const {groupId} = useParams();

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
				open(Modal.modalTypes.EDIT_ATTRIBUTE_EVENT_MODAL, {
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
					groupId={groupId}
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

export default View;

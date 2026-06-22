import ClayTabs from '@clayui/tabs';
import CriteriaSidebarItem from './CriteriaSidebarItem';
import EventDefinitionsQuery, {
	EventDefinitionsData,
	EventDefinitionsVariables
} from 'event-analysis/queries/EventDefinitionsQuery';
import Loading from 'shared/components/Loading';
import React, {useEffect, useState} from 'react';
import {ClayPaginationWithBasicItems} from '@clayui/pagination';
import {convertEventToProperty} from '../utils/utils';
import {EventTypes} from 'event-analysis/utils/types';
import {getDefaultValue} from './CriteriaSidebarCollapse';
import {List} from 'immutable';
import {NAME} from 'shared/util/pagination';
import {OrderByDirections} from 'shared/util/constants';
import {PaginationBar} from '@clayui/pagination-bar';
import {Property} from 'shared/util/records';
import {useQuery} from '@apollo/client';

const CUSTOM_EVENTS_PAGE_SIZE = 10;

const DEFAULT_TAB = 0;
const CUSTOM_TAB = 1;

const renderProperties = (properties: List<Property>) => (
	<ul className='properties-list'>
		{properties.toArray().map((property, i) => {
			const {label, name, propertyKey, type} = property;

			return (
				<CriteriaSidebarItem
					className={`color--${propertyKey}`}
					defaultValue={getDefaultValue(property)}
					key={`${name}-${i}`}
					label={label}
					name={name}
					property={property}
					propertyKey={propertyKey}
					type={type}
				/>
			);
		})}
	</ul>
);

interface IEventsCriteriaTabsProps {
	defaultEvents: List<Property>;
	searchValue: string;
}

const EventsCriteriaTabs: React.FC<IEventsCriteriaTabsProps> = ({
	defaultEvents,
	searchValue
}) => {
	const [activeTab, setActiveTab] = useState<number>(CUSTOM_TAB);
	const [page, setPage] = useState(1);

	useEffect(() => {
		setPage(1);
	}, [searchValue]);

	const {data, loading} = useQuery<
		EventDefinitionsData,
		EventDefinitionsVariables
	>(EventDefinitionsQuery, {
		fetchPolicy: 'network-only',
		variables: {
			eventType: EventTypes.Custom,
			hidden: false,
			keyword: searchValue,
			page: page - 1,
			size: CUSTOM_EVENTS_PAGE_SIZE,
			sort: {
				column: NAME,
				type: OrderByDirections.Ascending
			}
		}
	});

	const customEvents = List(
		(data?.eventDefinitions?.eventDefinitions ?? []).map(
			convertEventToProperty
		)
	) as unknown as List<Property>;

	const totalCount = data?.eventDefinitions?.total ?? 0;
	const totalPages = Math.ceil(totalCount / CUSTOM_EVENTS_PAGE_SIZE);

	const filteredDefaultEvents = searchValue
		? (defaultEvents.filter(property =>
				(property?.label ?? '')
					.toLowerCase()
					.includes(searchValue.toLowerCase())
		  ) as List<Property>)
		: defaultEvents;

	const renderCustomTab = () => {
		if (loading) {
			return <Loading />;
		}

		return (
			<>
				{renderProperties(customEvents)}

				{totalPages > 1 && (
					<PaginationBar className='justify-content-center sidebar-pagination'>
						<ClayPaginationWithBasicItems
							active={page}
							onActiveChange={setPage}
							totalPages={totalPages}
						/>
					</PaginationBar>
				)}
			</>
		);
	};

	return (
		<div className='events-criteria-tabs'>
			<ClayTabs active={activeTab} onActiveChange={setActiveTab}>
				<ClayTabs.Item>{Liferay.Language.get('default')}</ClayTabs.Item>

				<ClayTabs.Item>{Liferay.Language.get('custom')}</ClayTabs.Item>
			</ClayTabs>

			{activeTab === DEFAULT_TAB
				? renderProperties(filteredDefaultEvents)
				: renderCustomTab()}
		</div>
	);
};

export default EventsCriteriaTabs;

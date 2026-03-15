import BasePage from 'settings/components/base-page/BasePage';
import EventAttributeDefinitionsQuery, {
	EventAttributeDefinitionsData,
	EventAttributeDefinitionsVariables
} from 'event-analysis/queries/EventAttributeDefinitionsQuery';
import ListComponent from 'shared/hoc/ListComponent';
import NoResultsDisplay from 'shared/components/NoResultsDisplay';
import React from 'react';
import TabsCard from './TabsCard';
import {attributeListColumns} from 'shared/util/table-columns';
import {AttributeTypes} from 'event-analysis/utils/types';
import {
	createOrderIOMap,
	getSortFromOrderIOMap,
	NAME
} from 'shared/util/pagination';
import {getDefinitions} from 'shared/util/breadcrumbs';
import {mapListResultsToProps} from 'shared/util/mappers';
import {useParams} from 'react-router';
import {useQuery} from '@apollo/client/react';
import {useQueryPagination} from 'shared/hooks/useQueryPagination';

const GlobalAttributeList: React.FC = () => {
	const {delta, orderIOMap, page, query} = useQueryPagination({
		initialOrderIOMap: createOrderIOMap(NAME)
	});

	const {channelId, groupId} = useParams();

	const response = useQuery<
		EventAttributeDefinitionsData,
		EventAttributeDefinitionsVariables
	>(EventAttributeDefinitionsQuery, {
		variables: {
			keyword: query,
			page: page - 1,
			size: delta,
			sort: getSortFromOrderIOMap(orderIOMap),
			type: AttributeTypes.Global
		}
	});

	return (
		<BasePage
			breadcrumbItems={[
				getDefinitions({groupId}),
				{active: true, label: Liferay.Language.get('event-attributes')}
			]}
			pageDescription={Liferay.Language.get(
				'attributes-provide-additional-context-for-events.-they-are-usually-event-specific-but-can-be-used-by-more-than-one.-global-attributes-will-be-sent-with-all-events-without-needing-to-be-configured'
			)}
			pageTitle={Liferay.Language.get('event-attributes')}
		>
			<TabsCard groupId={groupId}>
				<ListComponent
					{...mapListResultsToProps(response, result => ({
						items:
							result.eventAttributeDefinitions
								.eventAttributeDefinitions,
						total: result.eventAttributeDefinitions.total
					}))}
					columns={[
						attributeListColumns.getName({channelId, groupId}),
						attributeListColumns.displayName,
						attributeListColumns.description,
						attributeListColumns.sampleValue,
						attributeListColumns.dataType
					]}
					delta={delta}
					entityLabel={Liferay.Language.get(
						'global-attributes'
					).toLowerCase()}
					noResultsRenderer={
						<NoResultsDisplay
							title={Liferay.Language.get('empty-title-pages')}
						/>
					}
					orderIOMap={orderIOMap}
					page={page}
					query={query}
					rowIdentifier='id'
					showFilterAndOrder={false}
				/>
			</TabsCard>
		</BasePage>
	);
};

export default GlobalAttributeList;

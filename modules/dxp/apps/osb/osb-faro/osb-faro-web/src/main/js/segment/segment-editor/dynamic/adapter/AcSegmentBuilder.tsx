import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import EmptyState from '@clayui/empty-state';
import React, {ReactNode, useEffect, useMemo} from 'react';
import URLConstants from 'shared/util/url-constants';
import {acCriterionTypes} from './acCriterionTypes';
import {AddProperty} from '../context/referencedObjects';
import {Catalog} from '@liferay/osb-faro-segment-builder-web';
import {createAcCatalog} from './createAcCatalog';
import {Criteria, CriterionGroup} from '@liferay/osb-faro-segment-builder-web';
import {extractRemoteCriterionEntries} from '../criterion-types/extract';
import {FieldOwnerTypes, SegmentTypes} from 'shared/util/constants';
import {findPropertyByCriterion} from '../utils/utils';
import {List, Map} from 'immutable';
import {ODataSerializer} from './ODataSerializer';
import {Property, PropertyGroup} from 'shared/util/records';
import {ReferencedProperties} from '../context/referencedObjects';
import {RootState} from 'shared/store';
import {Routes, toRoute} from 'shared/util/router';
import {SegmentBuilder} from '@liferay/osb-faro-segment-builder-web';
import {translateQueryToCriteria} from '../utils/odata';
import {useCurrentUser} from 'shared/hooks/useCurrentUser';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

interface IAcSegmentBuilderProps {
	addProperty?: AddProperty;
	channelId: string;
	children?: ReactNode;
	criteriaString?: string;
	groupId: string;
	id?: string;
	onChange: (criteria: Criteria) => void;
	propertyGroupsIList: List<PropertyGroup>;
	referencedProperties: ReferencedProperties;
	segmentType: SegmentTypes;
	sequential?: boolean;
	value: CriterionGroup;
}

const withAccountEmptyState = (
	catalog: Catalog,
	paramGroupId: string | undefined,
	authorized: boolean
): Catalog => ({
	...catalog,
	sections: catalog.sections.map(section => {
		if (section.key !== FieldOwnerTypes.Account) {
			return section;
		}

		return {
			...section,
			emptyState: (
				<div className='empty-message mt-10 text-center'>
					<EmptyState
						className='text-center'
						description={Liferay.Language.get(
							'connect-a-data-source-containing-account-data'
						)}
						title={Liferay.Language.get('no-account-data-synced')}
					>
						<ClayLink
							decoration='underline'
							href={URLConstants.HelpConnectDxp}
							key='helpConnectDxpText'
							target='_blank'
						>
							{Liferay.Language.get(
								'learn-more-about-data-sources'
							)}

							<span className='inline-item inline-item-after'>
								<ClayIcon fontSize={10} symbol='shortcut' />
							</span>
						</ClayLink>

						{authorized && (
							<ClayLink
								button
								className='button-root mt-3'
								displayType='secondary'
								href={toRoute(
									Routes.SETTINGS_DATA_SOURCE_LIST,
									{
										groupId: paramGroupId
									}
								)}
							>
								{Liferay.Language.get('connect-data-source')}
							</ClayLink>
						)}
					</EmptyState>
				</div>
			)
		};
	})
});

/**
 * Analytics-cloud composition of `SegmentBuilder`. Resolves the AC-specific
 * inputs from outside the core: pulls `timeZoneId` from Redux, builds the
 * `Catalog` via `createAcCatalog` (with the account-section empty state
 * slotted in), derives the `findProperty` callback from the
 * referenced-properties context, hydrates referenced properties on mount
 * from the saved `criteriaString`, and forwards every drop of a sidebar
 * property to `addProperty`. The result is a single component that
 * `SegmentEditor` can drop in alongside its existing form controls.
 */
export default function AcSegmentBuilder({
	addProperty,
	channelId,
	children,
	criteriaString,
	groupId,
	id,
	onChange,
	propertyGroupsIList,
	referencedProperties,
	segmentType,
	sequential = false,
	value
}: IAcSegmentBuilderProps) {
	const timeZoneId = useSelector<RootState, string>(store =>
		store.getIn(['projects', groupId, 'data', 'timeZone', 'timeZoneId'])
	);

	const {groupId: paramGroupId} = useParams<{groupId: string}>();
	const currentUser = useCurrentUser();
	const authorized = currentUser.isAdmin();

	useEffect(() => {
		if (
			segmentType !== SegmentTypes.Batch ||
			!criteriaString ||
			!addProperty
		) {
			return;
		}

		extractRemoteCriterionEntries(
			translateQueryToCriteria(criteriaString)
		).forEach(({criterionType, id: entryId, name}) => {
			addProperty(criterionType.createProperty({id: entryId, name}));
		});
	}, []);

	const catalog = useMemo(() => {
		const built = createAcCatalog(propertyGroupsIList, {
			channelId,
			groupId,
			segmentType
		});

		return withAccountEmptyState(built, paramGroupId, authorized);
	}, [
		propertyGroupsIList,
		channelId,
		groupId,
		segmentType,
		paramGroupId,
		authorized
	]);

	const rowContext = useMemo(
		() => ({channelId, groupId, segmentType, timeZoneId}),
		[channelId, groupId, segmentType, timeZoneId]
	);

	const findProperty = useMemo(
		() => (criterion: any) =>
			findPropertyByCriterion(
				criterion,
				referencedProperties as Map<string, Map<string, Property>>
			),
		[referencedProperties]
	);

	return (
		<SegmentBuilder
			catalog={catalog}
			channelId={channelId}
			criterionTypes={acCriterionTypes}
			findProperty={findProperty}
			groupId={groupId}
			id={id}
			onChange={next => onChange(next as Criteria)}
			onPropertyDrop={item => {
				if (item.property && addProperty) {
					addProperty(item.property);
				}
			}}
			rowContext={rowContext}
			segmentType={segmentType}
			sequential={sequential}
			serializer={ODataSerializer}
			title={Liferay.Language.get('segment-criteria')}
			value={value}
		>
			{children}
		</SegmentBuilder>
	);
}

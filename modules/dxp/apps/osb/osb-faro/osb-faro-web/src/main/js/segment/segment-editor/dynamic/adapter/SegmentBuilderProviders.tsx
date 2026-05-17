import React, {ReactNode, useMemo} from 'react';
import {acCriterionTypes} from './acCriterionTypes';
import {CatalogRegistry} from '@liferay/osb-faro-segment-builder-web';
import {
	CatalogRegistryContext,
	FindRowPropertyContext,
	RowContext
} from '@liferay/osb-faro-segment-builder-web';
import {findPropertyByCriterion} from '../utils/utils';
import {Map} from 'immutable';
import {Property} from 'shared/util/records';
import {ReferencedProperties} from '../context/referencedObjects';
import {RootState} from 'shared/store';
import {SegmentTypes} from 'shared/util/constants';
import {useSelector} from 'react-redux';

const acRegistry = new CatalogRegistry(acCriterionTypes);

interface ISegmentBuilderProvidersProps {
	channelId: string;
	children: ReactNode;
	groupId: string;
	referencedProperties: ReferencedProperties;
	segmentType: SegmentTypes;
}

/**
 * Wraps the segment-builder core with the three contexts the
 * analytics-cloud adapter populates: the registry of `CriterionTypeDef`s,
 * the opaque `rowContext` for inputs (channel/group/timezone/segment-type),
 * and the criterion-to-property metadata resolver backed by the existing
 * `findPropertyByCriterion` lookup.
 */
export function SegmentBuilderProviders({
	channelId,
	children,
	groupId,
	referencedProperties,
	segmentType
}: ISegmentBuilderProvidersProps) {
	const timeZoneId = useSelector<RootState, string>(store =>
		store.getIn(['projects', groupId, 'data', 'timeZone', 'timeZoneId'])
	);

	const rowContext = useMemo(
		() => ({channelId, groupId, segmentType, timeZoneId}),
		[channelId, groupId, segmentType, timeZoneId]
	);

	const findProperty = useMemo(
		() =>
			(criterion: any): Property | undefined =>
				findPropertyByCriterion(
					criterion,
					referencedProperties as Map<string, Map<string, Property>>
				),
		[referencedProperties]
	);

	return (
		<CatalogRegistryContext.Provider value={acRegistry}>
			<RowContext.Provider value={rowContext}>
				<FindRowPropertyContext.Provider value={findProperty}>
					{children}
				</FindRowPropertyContext.Provider>
			</RowContext.Provider>
		</CatalogRegistryContext.Provider>
	);
}

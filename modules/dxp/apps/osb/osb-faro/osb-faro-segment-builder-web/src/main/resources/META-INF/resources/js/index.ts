/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '../css/main.scss';

export {default as Conjunction} from './components/Conjunction';
export {default as CriteriaBuilder} from './components/CriteriaBuilder';
export {default as CriteriaGroup} from './components/CriteriaGroup';
export {default as CriteriaRow} from './components/CriteriaRow';
export {default as CriteriaSidebar} from './components/CriteriaSidebar';
export {default as CriteriaSidebarItem} from './components/CriteriaSidebarItem';
export {default as CriteriaSidebarSearchBar} from './components/CriteriaSidebarSearchBar';
export {default as DropZone} from './components/DropZone';
export {default as EmptyDropZone} from './components/EmptyDropZone';
export {default as SegmentBuilder} from './components/SegmentBuilder';

export {default as PrimitiveBooleanInput} from './inputs/primitive/PrimitiveBooleanInput';
export {default as PrimitiveDateInput} from './inputs/primitive/PrimitiveDateInput';
export {default as PrimitiveNumberInput} from './inputs/primitive/PrimitiveNumberInput';
export {default as PrimitiveSelectInput} from './inputs/primitive/PrimitiveSelectInput';
export {default as PrimitiveTextInput} from './inputs/primitive/PrimitiveTextInput';

export {CatalogRegistry} from './registry/CatalogRegistry';

export {
	CatalogRegistryContext,
	FindRowPropertyContext,
	RowContext,
} from './registry/context';

export type {FindRowProperty, FindRowPropertyMeta} from './registry/context';

export {JsonSerializer} from './serializers/JsonSerializer';

export type {
	Catalog,
	CatalogItem,
	CatalogSection,
	CatalogSubgroup,
	Criterion,
	CriterionGroup,
	CriterionTypeDef,
	PocInputProps,
	Serializer,
} from './types';

export {Conjunctions, SUPPORTED_CONJUNCTION_OPTIONS} from './utils/constants';

export {DragTypes} from './utils/drag-types';

export type {Criteria, OnCriterionAdd, OnMove, Operator} from './utils/types';

export {
	createNewGroup,
	generateGroupId,
	generateRowId,
	getChildGroupIds,
	getPropertyContextFromRaw,
	getPropertyNameFromRaw,
	isCriterionGroup,
	isValid,
	jsDatetoYYYYMMDD,
	objectToFormData,
	parseActivityKey,
	validateSegmentInputs,
} from './utils/utils';

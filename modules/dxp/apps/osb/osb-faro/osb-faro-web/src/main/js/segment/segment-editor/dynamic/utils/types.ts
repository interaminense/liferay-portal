import React from 'react';
import {CustomValue, Property} from 'shared/util/records';

export type {
	Criteria,
	Criterion,
	CriterionGroup,
	OnCriterionAdd,
	OnMove,
	Operator
} from '@liferay/osb-faro-segment-builder-web';

import type {Criterion} from '@liferay/osb-faro-segment-builder-web';

export type Context = {
	lastNodeWasGroup?: boolean;
	oDataASTNode: ODataASTNode;
	prevConjunction?: string;
};

export type ODataASTNode = {
	next?: number;
	position?: number;
	raw?: string;
	type: string;
	value: any;
};

export interface ISegmentEditorInputBase {
	channelId?: string;
	className?: string;
	displayValue?: string;
	groupId?: string;
	id?: string;
	onChange: (params: Criterion | Criterion[]) => void;
	operatorRenderer: React.ElementType;
	property: Property;
	timeZoneId?: string;
	touched?: boolean | object;
	valid?: boolean | object;
	value: string | number | CustomValue;
}

export interface ISegmentEditorCustomInputBase extends ISegmentEditorInputBase {
	property: Property;
	value: CustomValue;
}

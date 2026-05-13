/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {Fragment} from 'react';

import {
	DEFAULT_OPERATOR_FOR_TYPE,
	DEFAULT_VALUE_FOR_TYPE,
} from '../utils/constants';
import {
	Criteria,
	Criterion,
	CriterionGroup,
	Property,
} from '../utils/types';
import {generateRowId} from '../utils/utils';
import {Conjunction} from './Conjunction';
import {CriteriaRow} from './CriteriaRow';
import {DropZone} from './DropZone';

interface ICriteriaBuilderProps {
	criteria: CriterionGroup;
	onChange: (next: CriterionGroup) => void;
}

const propertyToCriterion = (property: Property): Criterion => ({
	operatorName: DEFAULT_OPERATOR_FOR_TYPE[property.type],
	propertyLabel: property.label,
	propertyName: property.name,
	rowId: generateRowId(),
	type: property.type,
	value:
		property.defaultValue !== undefined
			? property.defaultValue
			: DEFAULT_VALUE_FOR_TYPE[property.type],
});

export const CriteriaBuilder = ({
	criteria,
	onChange,
}: ICriteriaBuilderProps) => {
	const appendProperty = (property: Property) => {
		onChange({
			...criteria,
			items: [...criteria.items, propertyToCriterion(property)],
		});
	};

	const replaceItem = (index: number, next: Criteria) => {
		const items = [...criteria.items];
		items[index] = next;
		onChange({...criteria, items});
	};

	const removeItem = (index: number) => {
		const items = criteria.items.filter((_, i) => i !== index);
		onChange({...criteria, items});
	};

	const setConjunction = (next: string) => {
		onChange({
			...criteria,
			conjunctionName: next as CriterionGroup['conjunctionName'],
		});
	};

	if (!criteria.items.length) {
		return (
			<div className="criteria-builder empty">
				<DropZone onDropProperty={appendProperty} />

				<div className="criteria-builder-empty-hint">
					{Liferay.Language.get(
						'drag-a-property-from-the-sidebar-to-add-a-criterion'
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="criteria-builder">
			{criteria.items.map((item, index) => {
				const isCriterion = !(item as CriterionGroup).items;

				const rowKey = isCriterion
					? (item as Criterion).rowId
					: (item as CriterionGroup).criteriaGroupId;

				return (
					<Fragment key={rowKey}>
						{index > 0 && (
							<Conjunction
								conjunctionName={criteria.conjunctionName}
								onChange={setConjunction}
							/>
						)}

						{isCriterion && (
							<CriteriaRow
								criterion={item as Criterion}
								onChange={(next) => replaceItem(index, next)}
								onDelete={() => removeItem(index)}
							/>
						)}
					</Fragment>
				);
			})}

			<DropZone onDropProperty={appendProperty} />
		</div>
	);
};

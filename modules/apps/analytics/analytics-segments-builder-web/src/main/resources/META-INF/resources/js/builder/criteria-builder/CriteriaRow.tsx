/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import React from 'react';

import {Criterion} from '../utils/types';
import {getSupportedOperatorsFromType} from '../utils/utils';

interface ICriteriaRowProps {
	criterion: Criterion;
	onChange: (next: Criterion) => void;
	onDelete: () => void;
}

const renderValueInput = (
	criterion: Criterion,
	onChange: (next: Criterion) => void
) => {
	const update = (value: string | number | boolean) =>
		onChange({...criterion, value});

	switch (criterion.type) {
		case 'boolean':
			return (
				<select
					className="form-control criteria-row-value-input"
					onChange={(event) => update(event.target.value === 'true')}
					value={String(criterion.value)}
				>
					<option value="true">{Liferay.Language.get('true')}</option>
					<option value="false">
						{Liferay.Language.get('false')}
					</option>
				</select>
			);

		case 'number':
			return (
				<input
					className="form-control criteria-row-value-input"
					onChange={(event) =>
						update(
							event.target.value === ''
								? ''
								: Number(event.target.value)
						)
					}
					placeholder={Liferay.Language.get('value')}
					type="number"
					value={
						criterion.value === undefined ||
						criterion.value === null
							? ''
							: String(criterion.value)
					}
				/>
			);

		case 'date':
			return (
				<input
					className="form-control criteria-row-value-input"
					onChange={(event) => update(event.target.value)}
					type="date"
					value={String(criterion.value ?? '')}
				/>
			);

		default:
			return (
				<input
					className="form-control criteria-row-value-input"
					onChange={(event) => update(event.target.value)}
					placeholder={Liferay.Language.get('value')}
					type="text"
					value={String(criterion.value ?? '')}
				/>
			);
	}
};

export const CriteriaRow = ({
	criterion,
	onChange,
	onDelete,
}: ICriteriaRowProps) => {
	const operators = getSupportedOperatorsFromType(criterion.type);

	return (
		<div className="criteria-row">
			<span className="criteria-row-property">
				{criterion.propertyLabel || criterion.propertyName}
			</span>

			<select
				className="form-control criteria-row-operator"
				onChange={(event) =>
					onChange({...criterion, operatorName: event.target.value})
				}
				value={criterion.operatorName || ''}
			>
				{operators.map((operator) => (
					<option key={operator.name} value={operator.name}>
						{operator.label}
					</option>
				))}
			</select>

			{renderValueInput(criterion, onChange)}

			<ClayButton
				aria-label={Liferay.Language.get('remove')}
				className="criteria-row-delete"
				displayType="unstyled"
				onClick={onDelete}
				size="sm"
			>
				<ClayIcon symbol="times" />
			</ClayButton>
		</div>
	);
};

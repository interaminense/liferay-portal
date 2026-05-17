/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import {PocInputProps} from '../../types';

/**
 * Select-from-options input for primitive consumers. The `options` array
 * comes from the `CatalogItem`; when absent, the field falls back to a
 * read-only placeholder so the row still renders.
 */
const PrimitiveSelectInput: React.FC<PocInputProps<string>> = ({
	displayValue,
	onChange,
	operatorRenderer: OperatorRenderer,
	options,
	value,
}) => (
	<div className="align-items-center d-flex primitive-input-row">
		{displayValue && <span className="text-nowrap">{displayValue}</span>}

		<span className="mx-2">
			<OperatorRenderer />
		</span>

		<select
			className="form-control mr-2"
			onChange={(event) =>
				onChange({
					touched: true,
					valid: true,
					value: event.target.value,
				})
			}
			value={(value as string) ?? ''}
		>
			{(options ?? []).map((option) => (
				<option key={String(option.value)} value={String(option.value)}>
					{option.label}
				</option>
			))}
		</select>
	</div>
);

export default PrimitiveSelectInput;

/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import {PocInputProps} from '../../types';

const PrimitiveDateInput: React.FC<PocInputProps<string>> = ({
	displayValue,
	onChange,
	operatorRenderer: OperatorRenderer,
	value,
}) => (
	<div className="align-items-center d-flex primitive-input-row">
		{displayValue && <span className="text-nowrap">{displayValue}</span>}

		<span className="mx-2">
			<OperatorRenderer />
		</span>

		<input
			className="form-control mr-2"
			onChange={(event) =>
				onChange({
					touched: true,
					valid: true,
					value: event.target.value,
				})
			}
			type="date"
			value={value ?? ''}
		/>
	</div>
);

export default PrimitiveDateInput;

/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import React from 'react';

import LayoutFields from './Fields';
import {TColumns} from './types';

interface ILayoutColumnsProps extends React.HTMLAttributes<HTMLElement> {
	boxIndex: number;
	columns?: TColumns;
	rowIndex: number;
	tabIndex: number;
}

const LayoutColumns: React.FC<ILayoutColumnsProps> = ({
	boxIndex,
	columns,
	rowIndex,
	tabIndex,
}) => {
	return (
		<>
			{columns?.map(({fields}, columnIndex) => {
				return (
					<div
						className="layout-tab__columns"
						key={`column_${columnIndex}`}
						style={{width: `${100 / columns.length}%`}}
					>
						{!!fields?.length && (
							<LayoutFields
								boxIndex={boxIndex}
								columnIndex={columnIndex}
								fields={fields}
								rowIndex={rowIndex}
								tabIndex={tabIndex}
							/>
						)}
					</div>
				);
			})}
		</>
	);
};

export default LayoutColumns;

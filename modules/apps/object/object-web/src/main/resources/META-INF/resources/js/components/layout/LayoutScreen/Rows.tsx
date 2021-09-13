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

import LayoutColumns from './Columns';
import {TRows} from './types';

interface ILayoutRowsProps extends React.HTMLAttributes<HTMLElement> {
	boxIndex: number;
	rows?: TRows;
	tabIndex: number;
}

const LayoutRows: React.FC<ILayoutRowsProps> = ({boxIndex, rows, tabIndex}) => {
	return (
		<>
			{rows?.map(({columns}, rowIndex) => {
				return (
					<div className="layout-tab__rows" key={`row_${rowIndex}`}>
						{!!columns?.length && (
							<LayoutColumns
								boxIndex={boxIndex}
								columns={columns}
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

export default LayoutRows;

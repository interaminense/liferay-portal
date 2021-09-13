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

import React, {useContext} from 'react';

import {normalizeLanguageId} from '../../../utils/string';
import Panel from '../../Panel/Panel';
import LayoutContext, {TYPES} from '../context';
import DropdownWithDeleteButton from './DropdownWithDeleteButton';
import RequiredLabel from './RequiredLabel';
import {TObjectField} from './types';

const defaultLanguageId = normalizeLanguageId(
	Liferay.ThemeDisplay.getDefaultLanguageId()
);

interface ILayoutFieldsProps extends React.HTMLAttributes<HTMLElement> {
	boxIndex: number;
	columnIndex: number;
	fields: number[];
	rowIndex: number;
	tabIndex: number;
}

const LayoutFields: React.FC<ILayoutFieldsProps> = ({
	boxIndex,
	columnIndex,
	fields,
	rowIndex,
	tabIndex,
}) => {
	const [{objectFields}, dispatch] = useContext(LayoutContext);

	return (
		<>
			{fields.map(({label, required, type}, fieldIndex) => {
				return (
					<Panel key={`field_${fieldIndex}`}>
						<Panel.SimpleBody
							contentRight={
								<DropdownWithDeleteButton
									onClick={() => {
										dispatch({
											payload: {
												boxIndex,
												columnIndex,
												fieldIndex,
												rowIndex,
												tabIndex,
											},
											type: TYPES.DELETE_FIELD,
										});
									}}
								/>
							}
							title={label[defaultLanguageId]}
						>
							<small className="text-secondary">{type} | </small>

							<RequiredLabel required={required} />
						</Panel.SimpleBody>
					</Panel>
				);
			})}
		</>
	);
};

export default LayoutFields;

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

import ClayButton from '@clayui/button';
import {ClayToggle} from '@clayui/form';
import {useModal} from '@clayui/modal';
import React, {useContext, useState} from 'react';

import Panel from '../../Panel/Panel';
import LayoutContext, {TYPES} from '../context';
import DropdownWithDeleteButton from './DropdownWithDeleteButton';
import ModalAddNewField from './ModalAddNewField';
import LayoutRows from './Rows';
import {TRows} from './types';

interface ILayoutBoxProps extends React.HTMLAttributes<HTMLElement> {
	boxIndex: number;
	tabIndex: number;
	collapsible: boolean;
	label: string;
	rows?: TRows;
}

const LayoutBox: React.FC<ILayoutBoxProps> = ({
	boxIndex,
	collapsible,
	label,
	rows,
	tabIndex,
}) => {
	const [, dispatch] = useContext(LayoutContext);
	const [visibleModal, setVisibleModal] = useState(false);
	const {observer, onClose} = useModal({
		onClose: () => setVisibleModal(false),
	});

	return (
		<>
			<Panel>
				<Panel.Header
					contentRight={
						<>
							<ClayToggle
								aria-label={Liferay.Language.get('collapsible')}
								label={Liferay.Language.get('collapsible')}
								onToggle={(value) => {
									dispatch({
										payload: {
											boxIndex,
											collapsible: value,
											tabIndex,
										},
										type: TYPES.CHANGE_TOGGLE_COLLAPSIBLE,
									});
								}}
								toggled={collapsible}
							/>

							<ClayButton
								className="ml-4"
								displayType="secondary"
								onClick={() => setVisibleModal(true)}
								small
							>
								{Liferay.Language.get('add-field')}
							</ClayButton>

							<DropdownWithDeleteButton
								onClick={() => {
									dispatch({
										payload: {
											boxIndex,
											tabIndex,
										},
										type: TYPES.DELETE_BOX,
									});
								}}
							/>
						</>
					}
					title={label}
				/>

				{!!rows?.length && (
					<Panel.Body>
						<LayoutRows
							boxIndex={boxIndex}
							rows={rows}
							tabIndex={tabIndex}
						/>
					</Panel.Body>
				)}
			</Panel>

			{visibleModal && (
				<ModalAddNewField
					boxIndex={boxIndex}
					observer={observer}
					onClose={onClose}
					tabIndex={tabIndex}
				/>
			)}
		</>
	);
};

export default LayoutBox;

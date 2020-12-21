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

import {ClayButtonWithIcon} from '@clayui/button';
import ClayForm, {ClayRadio, ClayRadioGroup, ClayToggle} from '@clayui/form';
import ClayPopover from '@clayui/popover';
import {ClayTooltipProvider} from '@clayui/tooltip';
import {
	DataDefinitionUtils,
	DataLayoutBuilderActions,
} from 'data-engine-taglib';
import React, {useContext, useEffect, useRef, useState} from 'react';

import isClickOutside from '../../utils/clickOutside.es';

export default ({AppContext, dataLayoutBuilder, index}) => {
	const popoverRef = useRef(null);
	const triggerRef = useRef(null);
	const [showPopover, setShowPopover] = useState(false);
	const []
	const [
		{
			dataDefinition,
			dataLayout: {dataLayoutFields},
			focusedField: {fieldName},
		},
		dispatch,
	] = useContext(AppContext);

	const dataDefinitionField = DataDefinitionUtils.getDataDefinitionField(
		dataDefinition,
		fieldName
	);

	const requiredAtFormViewLevel = dataLayoutFields[fieldName]?.required ?? false;
	// const requiredAtObjectViewLevel = requiredAtFormViewLevel && dataDefinitionField.required;

	function setRequireAtFormViewLevel(toggle) {
		// Set required within an edited field in the data engine

		dispatch({
			payload: {
				dataLayoutFields: {
					...dataLayoutFields,
					[fieldName]: {
						...dataLayoutFields[fieldName],
						required: toggle,
					},
				},
			},
			type: DataLayoutBuilderActions.UPDATE_DATA_LAYOUT_FIELDS,
		});
	
		// Set required within an edited field in the form builder

		dataLayoutBuilder.dispatch('fieldEdited', {
			fieldName,
			propertyName: 'required',
			propertyValue: toggle,
		});
	}

	useEffect(() => {
		const handler = ({target}) => {
			const outside = isClickOutside(
				target,
				popoverRef?.current,
				triggerRef?.current
			);

			if (outside) {
				setShowPopover(false);
			}
		};

		window.addEventListener('click', handler);

		return () => window.removeEventListener('click', handler);
	}, [popoverRef, triggerRef]);

	return (
		<div className="d-flex ddm-field form-renderer-required-field justify-content-between" data-field-name={fieldName} key={index}>
			<ClayForm.Group className="form-renderer-required-field__toggle">
				<ClayToggle
					label={Liferay.Language.get('required-field')}
					onToggle={(toggle) => {
						setRequireAtFormViewLevel(toggle);
					}}
					toggled={requiredAtFormViewLevel}
				/>
			</ClayForm.Group>

			<ClayTooltipProvider>
				<ClayButtonWithIcon
					borderless
					disabled={!requiredAtFormViewLevel}
					displayType="secondary"
					onClick={() => setShowPopover(!showPopover)}
					ref={triggerRef}
					small
					symbol="ellipsis-v"
					title={Liferay.Language.get('required-options')}
				/>
			</ClayTooltipProvider>

			<ClayPopover
				alignPosition="bottom-right"
				className="form-renderer-required-field__popover"
				header={Liferay.Language.get('required-options')}
				onShowChange={setShowPopover}
				ref={popoverRef}
				show={showPopover}
			>
				<div className="mt-2">
					<ClayRadioGroup
						onSelectedValueChange={(value) => {
							console.log(value)
						}}
						selectedValue="view-level"
					>
						<ClayRadio
							label={Liferay.Language.get('only-for-this-form')}
							value="view-level"
						/>

						<ClayRadio
							label={Liferay.Language.get('for-all-forms-of-this-object')}
							value="object-level"
						/>
					</ClayRadioGroup>
				</div>
			</ClayPopover>
		</div>
	);
};
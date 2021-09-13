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
import ClayForm, {ClayInput, ClayRadio, ClayRadioGroup} from '@clayui/form';
import ClayModal from '@clayui/modal';
import React, {useContext, useState} from 'react';

import RequiredMask from '../../RequiredMask';
import LayoutContext, {TYPES} from '../context';

const tabType = [
	{
		description: Liferay.Language.get(
			'to-display-fields-and-one-to-one-relationships'
		),
		label: Liferay.Language.get('fields'),
		value: 'fields',
	},
	{
		description: Liferay.Language.get('to-display-multiple-relationships'),
		label: Liferay.Language.get('relationships'),
		value: 'relationships',
	},
];

interface IModalAddNewTabProps extends React.HTMLAttributes<HTMLElement> {
	observer: any;
	onClose: () => void;
}

const ModalAddNewTab: React.FC<IModalAddNewTabProps> = ({
	observer,
	onClose,
}) => {
	const [label, setLabel] = useState<string>('');
	const [selectedType, setSelectedType] = useState<string>('fields');
	const [, dispatch] = useContext(LayoutContext);

	return (
		<ClayModal observer={observer}>
			<ClayModal.Header>
				{Liferay.Language.get('add-tab')}
			</ClayModal.Header>
			<ClayModal.Body>
				<ClayForm.Group>
					<label htmlFor="inputLabel">
						{Liferay.Language.get('label')}

						<RequiredMask />
					</label>

					<ClayInput
						id="inputLabel"
						onChange={(event) => setLabel(event.target.value)}
						type="text"
						value={label}
					/>
				</ClayForm.Group>

				<ClayForm.Group>
					<label htmlFor="inputType">
						{Liferay.Language.get('type')}
					</label>

					<ClayRadioGroup
						id="inputType"
						onSelectedValueChange={(value) =>
							setSelectedType(value as string)
						}
						selectedValue={selectedType}
					>
						{tabType.map(({label, value}) => (
							<ClayRadio
								key={value}
								label={label}
								value={value}
							/>
						))}
					</ClayRadioGroup>
				</ClayForm.Group>
			</ClayModal.Body>
			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton displayType="secondary" onClick={onClose}>
							{Liferay.Language.get('cancel')}
						</ClayButton>
						<ClayButton
							onClick={() => {
								dispatch({
									payload: {
										label,
										type: selectedType,
									},
									type: TYPES.ADD_NEW_TAB,
								});

								onClose();
							}}
						>
							{Liferay.Language.get('save')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	);
};

export default ModalAddNewTab;

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
import ClayDropDown from '@clayui/drop-down';
import ClayForm from '@clayui/form';
import ClayLabel from '@clayui/label';
import ClayModal from '@clayui/modal';
import React, {useContext, useState} from 'react';

import CustomSelect from '../CustomSelect/CustomSelect';

import RequiredMask from '../RequiredMask';
import LayoutContext, {TYPES} from './context';

interface IModalAddNewFieldProps extends React.HTMLAttributes<HTMLElement> {
	boxIndex: number;
	observer: any;
	onClose: () => void;
	tabIndex: number;
}

const ModalAddNewField: React.FC<IModalAddNewFieldProps> = ({
	boxIndex,
	observer,
	onClose,
	tabIndex,
}) => {
	const [, dispatch] = useContext(LayoutContext);
	const [active, setActive] = useState<boolean>(false);
	const [query, setQuery] = useState<string>('');
	const [selectedQuery, setSelectedQuery] = useState<string>('');

	return (
		<ClayModal observer={observer}>
			<ClayModal.Header>
				{Liferay.Language.get('add-block')}
			</ClayModal.Header>
			<ClayModal.Body>
				<ClayForm.Group>
					<label htmlFor="inputField">
						{Liferay.Language.get('field')}
					</label>

					<ClayDropDown
						active={active}
						onActiveChange={(value) => setActive(value)}
						trigger={<CustomSelect value={selectedQuery} />}
					>
						<ClayDropDown.Search
							onChange={(event) => setQuery(event.target.value)}
							placeholder={Liferay.Language.get('search')}
							value={query}
						/>

						<ClayDropDown.ItemList>
							{[
								{label: 'one', required: true},
								{label: 'two', required: false},
								{label: 'three', required: true},
								{label: 'four', required: false},
							]
								.filter(({label}) => label.match(query))
								.map(({label, required}, index) => (
									<ClayDropDown.Item
										key={index}
										onClick={() => {
											setSelectedQuery(label);
											setActive(false);
										}}
									>
										<div className="d-flex justify-content-between">
											<div>{label}</div>
											<div>
												{required ? (
													<ClayLabel displayType="warning">
														{Liferay.Language.get(
															'required'
														)}
													</ClayLabel>
												) : (
													<ClayLabel displayType="success">
														{Liferay.Language.get(
															'optional'
														)}
													</ClayLabel>
												)}
											</div>
										</div>
									</ClayDropDown.Item>
								))}
						</ClayDropDown.ItemList>
					</ClayDropDown>
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
										boxIndex,
										label: selectedQuery,
										tabIndex,
									},
									type: TYPES.ADD_NEW_FIELD,
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

export default ModalAddNewField;

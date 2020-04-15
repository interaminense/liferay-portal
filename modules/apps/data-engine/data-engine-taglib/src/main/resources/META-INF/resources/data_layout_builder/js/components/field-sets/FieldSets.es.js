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
import ClayModal, {useModal} from '@clayui/modal';
import React, {useContext, useState} from 'react';

import App from '../../App.es';
import AppContext from '../../AppContext.es';
import {DRAG_FIELDSET} from '../../drag-and-drop/dragTypes.es';
import {containsFieldSet} from '../../utils/dataDefinition.es';
import FieldType from '../field-types/FieldType.es';

const Modal = ({isVisible, onClose}) => {
	const {observer} = useModal({
		onClose,
	});

	if (!isVisible) {
		return null;
	}

	console.log(window.AppProps);

	return (
		<ClayModal
			observer={observer}
			size="full-screen"
		>
			<ClayModal.Header>
				header
			</ClayModal.Header>
			<ClayModal.Body>
				<App {...window.AppProps} />
			</ClayModal.Body>
			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton displayType="secondary" onClick={onClose}>
							{Liferay.Language.get('cancel')}
						</ClayButton>
						<ClayButton
							onClick={() => {}}
						>
							{Liferay.Language.get('save')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	);
};

export default function FieldSets() {
	const [{dataDefinition, fieldSets}] = useContext(AppContext);
	const [isVisible, setIsVisible] = useState(false);

	return (
		<>
			<ClayButton onClick={() => {
				setIsVisible(true)
			}}>
				add fieldset
			</ClayButton>

			{fieldSets.map(fieldSet => (
				<FieldType
					description={`${
						fieldSet.dataDefinitionFields.length
					} ${Liferay.Language.get('fields')}`}
					disabled={containsFieldSet(dataDefinition, fieldSet.id)}
					dragType={DRAG_FIELDSET}
					fieldSet={fieldSet}
					icon="forms"
					key={fieldSet.dataDefinitionKey}
					label={fieldSet.name[themeDisplay.getLanguageId()]}
				/>
			))}

			<Modal
				isVisible={isVisible}
				onClose={() => setIsVisible(false)}
			/>
		</>
	);
}

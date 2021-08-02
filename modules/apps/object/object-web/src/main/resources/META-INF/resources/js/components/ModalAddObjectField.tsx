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
import ClayForm, {ClayInput, ClaySelect} from '@clayui/form';
import ClayModal, {ClayModalProvider, useModal} from '@clayui/modal';
import React, {useEffect, useState} from 'react';

import RequiredMask from './RequiredMask';

interface IProps extends React.HTMLAttributes<HTMLElement> {
	apiURL: string;
	spritemap: string;
}

const ObjectFieldTypes = [
	'BigDecimal',
	'Boolean',
	'Date',
	'Double',
	'Integer',
	'Long',
	'String',
];

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
	infer ElementType
>
	? ElementType
	: never;
type TObjectFieldType = ElementType<typeof ObjectFieldTypes>;

interface AddObjectFieldRequest {
	indexed: boolean;
	indexedAsKeyword: boolean;
	name: string;
	required: boolean;
	type: TObjectFieldType;
}

const ModalAddObjectField: React.FC<IProps> = ({apiURL, spritemap}) => {
	const [error, setError] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [type, setType] = useState<TObjectFieldType>(
		ObjectFieldTypes[0] as TObjectFieldType
	);
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	const {observer, onClose} = useModal({
		onClose: () => setVisibleModal(false),
	});

	const handleSaveObjectField = () => {
		Liferay.Util.fetch(apiURL, {
			body: JSON.stringify({
				indexed: true,
				indexedAsKeyword: true,
				name,
				required: false,
				type,
			} as AddObjectFieldRequest),
			headers: new Headers({
				Accept: 'application/json',
				'Content-Type': 'application/json',
			}),
			method: 'POST',
		})
			.then((response: any) => {
				if (response.ok) {
					onClose();

					window.location.reload();
				}
				else {
					return response.json();
				}
			})
			.then(({title}: {title: string}) => {
				setError(title);
			});
	};

	const handleOpenObjectFieldModal = () => setVisibleModal(true);

	useEffect(() => {
		Liferay.on('addObjectField', handleOpenObjectFieldModal);

		return () => {
			Liferay.detach('addObjectField', handleOpenObjectFieldModal);
		};
	}, []);

	return (
		<>
			{visibleModal && (
				<ClayModal observer={observer}>
					<ClayModal.Header>
						{Liferay.Language.get('create-new-field')}
					</ClayModal.Header>
					<ClayModal.Body>
						<ClayForm.Group className={error ? 'has-error' : ''}>
							<label htmlFor="objectFieldName">
								{Liferay.Language.get('name')}

								<RequiredMask />
							</label>

							<ClayInput
								id="objectFieldName"
								onChange={({target: {value}}) => setName(value)}
								type="text"
								value={name}
							/>

							{error && (
								<ClayForm.FeedbackGroup>
									<ClayForm.FeedbackItem>
										<ClayForm.FeedbackIndicator
											spritemap={spritemap}
											symbol="exclamation-full"
										/>
										{error}
									</ClayForm.FeedbackItem>
								</ClayForm.FeedbackGroup>
							)}
						</ClayForm.Group>

						<ClayForm.Group>
							<label htmlFor="objectFieldType">
								{Liferay.Language.get('type')}
							</label>

							<ClaySelect
								id="objectFieldType"
								onChange={({target: {value}}) => setType(value)}
							>
								{ObjectFieldTypes.map((type) => (
									<ClaySelect.Option
										key={type}
										label={type}
										value={type}
									/>
								))}
							</ClaySelect>
						</ClayForm.Group>
					</ClayModal.Body>
					<ClayModal.Footer
						last={
							<ClayButton.Group key={1} spaced>
								<ClayButton
									displayType="secondary"
									onClick={() => onClose()}
								>
									{Liferay.Language.get('cancel')}
								</ClayButton>

								<ClayButton
									displayType="primary"
									onClick={() => handleSaveObjectField()}
								>
									{Liferay.Language.get('save')}
								</ClayButton>
							</ClayButton.Group>
						}
					/>
				</ClayModal>
			)}
		</>
	);
};

const ModalWithProvider: React.FC<IProps> = ({apiURL, spritemap}) => {
	return (
		<ClayModalProvider>
			<ModalAddObjectField apiURL={apiURL} spritemap={spritemap} />
		</ClayModalProvider>
	);
};

export default ModalWithProvider;

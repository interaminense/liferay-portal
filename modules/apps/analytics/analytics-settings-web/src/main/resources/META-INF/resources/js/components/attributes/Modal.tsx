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
import ClayModal from '@clayui/modal';
import React, {useState} from 'react';

import {TQueries} from '../../utils/request';
import Table, {TColumn, TStorageItems} from '../table/Table';

type TRawItem = {
	example: string;
	name: string;
	required: boolean;
	selected: boolean;
	source: string;
	type: string;
};

export interface ICommonModalProps {
	observer: any;
	onCloseModal: () => void;
}

interface IModalProps {
	columns: TColumn[];
	fetchFn: (params: TQueries) => Promise<any>;
	observer: any;
	onAddItems: (items: TStorageItems) => void;
	onCloseModal: () => void;
	title: string;
}

const Modal: React.FC<IModalProps> = ({
	columns,
	fetchFn,
	observer,
	onAddItems,
	onCloseModal,
	title,
}) => {
	const [items, setItems] = useState<TStorageItems>({});

	return (
		<ClayModal center observer={observer} size="lg">
			<ClayModal.Header>{title}</ClayModal.Header>

			<ClayModal.Body>
				<Table
					columns={columns}
					emptyStateTitle={Liferay.Language.get(
						'there-are-no-attributes'
					)}
					fetchFn={fetchFn}
					mapperItems={(items: TRawItem[]) => {
						return items.map(
							({
								example,
								name,
								required,
								selected,
								source,
								type,
							}) => ({
								checked: selected,
								columns: [name, type, example, source],
								disabled: required,
								id: name,
							})
						);
					}}
					noResultsTitle={Liferay.Language.get(
						'no-attributes-were-found'
					)}
					onItemsChange={setItems}
				/>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							displayType="secondary"
							onClick={() => onCloseModal()}
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton onClick={() => onAddItems(items)}>
							{Liferay.Language.get('sync')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	);
};

export function getFields(items: TStorageItems): TRawItem[] {
	return Object.values(items).map(
		({checked, columns: [name, type, example, source], disabled}) => ({
			example,
			name,
			required: disabled,
			selected: checked,
			source,
			type,
		})
	);
}

export default Modal;

import Form from 'shared/components/form';
import getCN from 'classnames';
import Input from 'shared/components/Input';
import React from 'react';
import {Columns, Modal} from 'shared/types';
import {createOrderIOMap, NAME} from 'shared/util/pagination';
import {detailsListColumns} from 'shared/util/table-columns';
import {OrderedMap} from 'immutable';
import {OrderParams} from 'shared/util/records';
import {useModal} from 'shared/hooks/useModal';

interface ISelectEntityFromModalProps {
	columns: Columns;
	dataSourceFn?: (params: {[key: string]: any}) => Promise<any>;
	entity: {dataSourceName?: string; [key: string]: any};
	error: boolean;
	graphqlProps?: {[key: string]: any};
	groupId?: string;
	initialDelta?: number;
	initialOrderIOMap: OrderedMap<string, OrderParams>;
	noResultsIcon?: string;
	noResultsProps?: {[key: string]: any};
	onSubmit: (items: OrderedMap<string, object>) => void;
	orderByOptions?: {label: string; value: any}[];
	renderEntity: (entity: any) => React.ReactNode;
	submitMessage?: string;
	title: string;
}

const SelectEntityFromModal: React.FC<ISelectEntityFromModalProps> = ({
	columns,
	dataSourceFn,
	entity,
	error,
	graphqlProps,
	groupId,
	initialDelta = 10,
	initialOrderIOMap = createOrderIOMap(NAME),
	onSubmit,
	renderEntity,
	submitMessage = Liferay.Language.get('add'),
	title,
	...otherProps
}) => {
	const {close, open} = useModal();

	const handleModal = () => {
		const dataSourceOptions = graphqlProps || {dataSourceFn};
		const modalType = graphqlProps
			? Modal.modalTypes.SEARCHABLE_TABLE_MODAL_GRAPHQL
			: Modal.modalTypes.SEARCHABLE_TABLE_MODAL;

		open(modalType, {
			...dataSourceOptions,
			columns: [
				...columns,
				{
					...detailsListColumns.getDataSourceName(groupId),
					className: 'table-cell-expand',
					sortable: false
				}
			],
			dataSourceParams: {groupId},
			initialDelta,
			initialOrderIOMap,
			initialSelectedItems: entity ? [entity] : undefined,
			onClose: close,
			onSubmit: (items: OrderedMap<string, object>) => {
				onSubmit(items);

				close();
			},
			submitMessage,
			title,
			...otherProps
		});
	};

	return (
		<Form.GroupItem>
			<Input.Group className='select-entity-group'>
				<Input.GroupItem
					className={getCN({
						'has-error': error
					})}
				>
					<Input.Group className='select-input-root'>
						<Input.GroupItem>
							<Input />
						</Input.GroupItem>

						<div className='selected-item-container'>
							{renderEntity(entity)}
						</div>
					</Input.Group>
				</Input.GroupItem>

				<Input.Button
					displayType='secondary'
					onClick={handleModal}
					position='append'
				>
					{Liferay.Language.get('select')}
				</Input.Button>
			</Input.Group>
		</Form.GroupItem>
	);
};

export default SelectEntityFromModal;

import ClayButton from '@clayui/button';
import ClayModal, {useModal} from '@clayui/modal';
import ClayTabs from '@clayui/tabs';
import NoResultsDisplay from 'shared/components/NoResultsDisplay';
import React, {useEffect, useState} from 'react';
import {FrontendDataSet, pagination} from 'shared/components/FrontendDataSet';
import {Sizes} from 'shared/util/constants';
import {
	ISyncField,
	ISyncFieldsTab,
	SYNC_FIELDS_ENTITIES,
} from './salesforceSyncFields';
import {
	getMockEndpoint,
	installSyncFieldsMockFetch,
} from './salesforceSyncFieldsMock';

interface ISyncFieldsDataSetProps {
	entityKey: string;
	onSelectedItemsChange: (selectedItems: ISyncField[]) => void;
	selectedItems: ISyncField[];
	tab: ISyncFieldsTab;
}

const SyncFieldsDataSet: React.FC<ISyncFieldsDataSetProps> = ({
	entityKey,
	onSelectedItemsChange,
	selectedItems,
	tab,
}) => {
	const dataTypes = Array.from(new Set(tab.fields.map(({type}) => type)));

	return (
		<FrontendDataSet
			apiURL={getMockEndpoint(entityKey, tab.entity)}
			filters={[
				{
					entityFieldType: 'string',
					id: 'type',
					itemKey: 'value',
					itemLabel: 'label',
					items: dataTypes.map((dataType) => ({
						label: dataType,
						value: dataType,
					})),
					label: Liferay.Language.get('data-type'),
					multiple: true,
					name: 'type',
					type: 'selection',
				},
			]}
			id={`${entityKey}-${tab.entity}-sync-fields`}
			onSelectedItemsChange={onSelectedItemsChange}
			pagination={pagination}
			selectedItems={selectedItems}
			selectedItemsKey="name"
			selectionType="multiple"
			showPagination
			sorts={[
				{
					active: true,
					direction: 'asc',
					key: 'name',
					label: Liferay.Language.get('attribute-name'),
				},
			]}
			views={[
				{
					contentRenderer: 'table',
					default: true,
					label: Liferay.Language.get('default-view'),
					name: 'table',
					schema: {
						fields: [
							{
								fieldName: 'name',
								label: Liferay.Language.get('attribute-name'),
								sortable: true,
							},
							{
								fieldName: 'type',
								label: Liferay.Language.get('data-type'),
								sortable: true,
							},
						],
					},
					thumbnail: 'table',
				},
			]}
		/>
	);
};

interface ISalesforceSyncFieldsModalProps {
	entityKey: string;
	onClose: () => void;
	onDone: (selectedCount: number) => void;
}

const SalesforceSyncFieldsModal: React.FC<ISalesforceSyncFieldsModalProps> = ({
	entityKey,
	onClose,
	onDone,
}) => {
	const {observer} = useModal({onClose});

	const entity = SYNC_FIELDS_ENTITIES[entityKey];

	const [restoreFetch] = useState(() =>
		installSyncFieldsMockFetch(
			entity.tabs.map((tab) => ({
				endpoint: getMockEndpoint(entityKey, tab.entity),
				fields: tab.fields,
			}))
		)
	);

	const [activeTab, setActiveTab] = useState(0);
	const [selectedByTab, setSelectedByTab] = useState<ISyncField[][]>(() =>
		entity.tabs.map((tab) => tab.fields.filter((field) => field.selected))
	);

	const hasMultipleTabs = entity.tabs.length > 1;

	useEffect(() => restoreFetch, [restoreFetch]);

	return (
		<ClayModal observer={observer} size="lg">
			<ClayModal.Header>{entity.modalTitle}</ClayModal.Header>

			<ClayModal.Body>
				{hasMultipleTabs && (
					<ClayTabs active={activeTab}>
						{entity.tabs.map((tab, index) => (
							<ClayTabs.Item
								active={activeTab === index}
								key={tab.entity}
								onClick={() => setActiveTab(index)}
							>
								{tab.label}
							</ClayTabs.Item>
						))}
					</ClayTabs>
				)}

				<ClayTabs.Content activeIndex={activeTab} fade>
					{entity.tabs.map((tab, index) => (
						<ClayTabs.TabPane
							aria-labelledby={tab.entity}
							key={tab.entity}
						>
							{tab.gatedOnFirst &&
							selectedByTab[0].length === 0 ? (
								<NoResultsDisplay
									className="py-5"
									description={entity.gateDescription}
									icon={{
										border: false,
										size: Sizes.XXXLarge,
										symbol: 'ac_satellite',
									}}
									title={Liferay.Language.get(
										'no-fields-available-yet'
									)}
								/>
							) : (
								<SyncFieldsDataSet
									entityKey={entityKey}
									onSelectedItemsChange={(selectedItems) =>
										setSelectedByTab((previousSelections) =>
											previousSelections.map(
												(selection, selectionIndex) => {
													if (
														selectionIndex === index
													) {
														return selectedItems;
													}

													if (
														index === 0 &&
														selectedItems.length ===
															0 &&
														entity.tabs[
															selectionIndex
														]?.gatedOnFirst
													) {
														return [];
													}

													return selection;
												}
											)
										)
									}
									selectedItems={selectedByTab[index]}
									tab={tab}
								/>
							)}
						</ClayTabs.TabPane>
					))}
				</ClayTabs.Content>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton displayType="secondary" onClick={onClose}>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton
							onClick={() => {
								onDone(
									selectedByTab.reduce(
										(total, selection) =>
											total + selection.length,
										0
									)
								);

								onClose();
							}}
						>
							{Liferay.Language.get('done')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	);
};

export default SalesforceSyncFieldsModal;

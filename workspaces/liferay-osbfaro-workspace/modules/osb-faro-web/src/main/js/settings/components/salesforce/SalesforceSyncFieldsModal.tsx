import ClayButton from '@clayui/button';
import ClayModal, {useModal} from '@clayui/modal';
import ClayTabs from '@clayui/tabs';
import NoResultsDisplay from 'shared/components/NoResultsDisplay';
import React, {useState} from 'react';
import {FrontendDataSet, pagination} from 'shared/components/FrontendDataSet';
import {
	ISyncField,
	ISyncFieldsTab,
	SYNC_FIELDS_ENTITIES,
} from './salesforceSyncFields';
import {Sizes} from 'shared/util/constants';

type SelectedField = {name: string};

interface ISyncFieldsDataSetProps {
	dataSourceId: string;
	entityKey: string;
	groupId: string;
	onSelectedItemsChange: (selectedItems: SelectedField[]) => void;
	selectedItems: SelectedField[];
	tab: ISyncFieldsTab;
	typeOptions: string[];
}

const SyncFieldsDataSet: React.FC<ISyncFieldsDataSetProps> = ({
	dataSourceId,
	entityKey,
	groupId,
	onSelectedItemsChange,
	selectedItems,
	tab,
	typeOptions,
}) => (
	<FrontendDataSet
		apiURL={`/o/faro/contacts/${groupId}/data_source/${dataSourceId}/field-catalog/${encodeURIComponent(
			tab.catalogKey
		)}`}
		filters={
			typeOptions.length
				? [
						{
							entityFieldType: 'string',
							id: 'type',
							itemKey: 'value',
							itemLabel: 'label',
							items: typeOptions.map((type) => ({
								label: type,
								value: type,
							})),
							label: Liferay.Language.get('data-type'),
							multiple: true,
							name: 'type',
							type: 'selection',
						},
					]
				: undefined
		}
		id={`${entityKey}-${tab.catalogKey}-sync-fields`}
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

interface ISalesforceSyncFieldsModalProps {
	catalog?: Record<string, ISyncField[]>;
	dataSourceId: string;
	entityKey: string;
	groupId: string;
	initialSelection: Record<string, string[]>;
	onClose: () => void;
	onDone: (entitySelection: Record<string, string[]>) => void;
}

const SalesforceSyncFieldsModal: React.FC<ISalesforceSyncFieldsModalProps> = ({
	catalog,
	dataSourceId,
	entityKey,
	groupId,
	initialSelection,
	onClose,
	onDone,
}) => {
	const {observer} = useModal({onClose});

	const entity = SYNC_FIELDS_ENTITIES[entityKey];

	const hasMultipleTabs = entity.tabs.length > 1;

	const [activeTab, setActiveTab] = useState(0);
	const [selectedByTab, setSelectedByTab] = useState<SelectedField[][]>(() =>
		entity.tabs.map((tab) =>
			(initialSelection[tab.catalogKey] ?? []).map((name) => ({name}))
		)
	);

	const getTypeOptions = (tab: ISyncFieldsTab): string[] => {
		if (!catalog) {
			return [];
		}

		const catalogKey = Object.keys(catalog).find(
			(key) => key.toLowerCase() === tab.catalogKey.toLowerCase()
		);

		const fields = catalogKey ? catalog[catalogKey] : [];

		return Array.from(new Set(fields.map((field) => field.type)));
	};

	const handleDone = () => {
		const entitySelection: Record<string, string[]> = {};

		entity.tabs.forEach((tab, index) => {
			entitySelection[tab.catalogKey] = (selectedByTab[index] ?? []).map(
				(field) => field.name
			);
		});

		onDone(entitySelection);

		onClose();
	};

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
							(selectedByTab[0]?.length ?? 0) === 0 ? (
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
									dataSourceId={dataSourceId}
									entityKey={entityKey}
									groupId={groupId}
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
									selectedItems={selectedByTab[index] ?? []}
									tab={tab}
									typeOptions={getTypeOptions(tab)}
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

						<ClayButton onClick={handleDone}>
							{Liferay.Language.get('done')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	);
};

export default SalesforceSyncFieldsModal;

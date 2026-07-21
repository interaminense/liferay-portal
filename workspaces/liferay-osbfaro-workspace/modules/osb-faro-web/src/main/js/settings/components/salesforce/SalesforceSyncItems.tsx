import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import ClayList from '@clayui/list';
import ClaySticker from '@clayui/sticker';
import React, {useEffect, useState} from 'react';
import SalesforceSyncFieldsModal from './SalesforceSyncFieldsModal';
import {ISyncField, SYNC_FIELDS_ENTITIES} from './salesforceSyncFields';
import {fetchSalesforceFieldCatalog} from 'shared/api/data-source';
import {sub} from 'shared/util/lang';
import {toThousands} from 'shared/util/numbers';
import {useRequest} from 'shared/hooks/useRequest';

interface ISyncItem {
	description: string;
	icon: string;
	key: string;
	title: string;
}

type FieldSelection = Record<string, string[]>;

const buildFieldSelection = (catalog: Record<string, ISyncField[]>) => {
	const fieldSelection: FieldSelection = {};

	SYNC_ITEMS.forEach(({key}) => {
		SYNC_FIELDS_ENTITIES[key]?.tabs.forEach((tab) => {
			const catalogKey = Object.keys(catalog).find(
				(candidate) =>
					candidate.toLowerCase() === tab.catalogKey.toLowerCase()
			);

			const fields = catalogKey ? catalog[catalogKey] : [];

			fieldSelection[tab.catalogKey] = fields
				.filter((field) => field.selected)
				.map((field) => field.name);
		});
	});

	return fieldSelection;
};

const countSelected = (fieldSelection: FieldSelection, entityKey: string) =>
	(SYNC_FIELDS_ENTITIES[entityKey]?.tabs ?? []).reduce(
		(total, tab) => total + (fieldSelection[tab.catalogKey]?.length ?? 0),
		0
	);

const SYNC_ITEMS: ISyncItem[] = [
	{
		description: Liferay.Language.get(
			'represents-fields-from-the-contact-and-leads-tables-within-salesforce'
		),
		icon: 'users',
		key: 'individuals',
		title: Liferay.Language.get('individuals'),
	},
	{
		description: Liferay.Language.get(
			'represents-fields-from-the-account-and-opportunity-table-within-salesforce'
		),
		icon: 'briefcase',
		key: 'accountsAndOpportunities',
		title: Liferay.Language.get('accounts-and-opportunities'),
	},
	{
		description: Liferay.Language.get(
			'represents-fields-from-the-campaign-and-campaign-members-table-within-salesforce'
		),
		icon: 'megaphone',
		key: 'campaignsAndCampaignMembers',
		title: Liferay.Language.get('campaigns-and-campaign-members'),
	},
];

interface ISalesforceSyncItemsProps {
	dataSourceId: string;
	disabled?: boolean;
	groupId: string;
	itemsSyncedCounts?: Record<string, number>;
	onFieldSelectionChange?: (fieldSelection: FieldSelection) => void;
}

const SalesforceSyncItems: React.FC<ISalesforceSyncItemsProps> = ({
	dataSourceId,
	disabled = false,
	groupId,
	itemsSyncedCounts,
	onFieldSelectionChange,
}) => {
	const {data: catalog} = useRequest({
		dataSourceFn: fetchSalesforceFieldCatalog,
		variables: {groupId, id: dataSourceId},
	});

	const [openEntityKey, setOpenEntityKey] = useState<string | null>(null);
	const [fieldSelection, setFieldSelection] = useState<FieldSelection>({});

	useEffect(() => {
		if (catalog) {
			const initialFieldSelection = buildFieldSelection(catalog);

			setFieldSelection(initialFieldSelection);

			onFieldSelectionChange?.(initialFieldSelection);
		}
	}, [catalog]);

	return (
		<div className="pt-1">
			<ClayList className="mb-0">
				{SYNC_ITEMS.map(({description, icon, key, title}) => {
					const countText = sub(
						Liferay.Language.get('x-items-selected').toLowerCase(),
						[countSelected(fieldSelection, key)]
					);

					return (
						<ClayList.Item flex key={key}>
							<ClayList.ItemField className="mt-n2">
								<ClaySticker displayType="unstyled">
									<ClayIcon
										className="text-secondary"
										symbol={icon}
									/>
								</ClaySticker>
							</ClayList.ItemField>

							<ClayList.ItemField expand>
								<ClayList.ItemTitle>{title}</ClayList.ItemTitle>

								<ClayList.ItemText>
									{description}
								</ClayList.ItemText>

								<ClayList.ItemText>
									{itemsSyncedCounts
										? `${countText} | ${sub(
												Liferay.Language.get(
													'x-items-synced'
												).toLowerCase(),
												[
													toThousands(
														itemsSyncedCounts[
															key
														] ?? 0
													),
												]
											)}`
										: countText}
								</ClayList.ItemText>
							</ClayList.ItemField>

							<ClayList.ItemField className="align-self-center">
								<ClayButton
									className="rounded-lg"
									disabled={disabled}
									displayType="secondary"
									onClick={() => setOpenEntityKey(key)}
									size="sm"
								>
									{Liferay.Language.get('select')}
								</ClayButton>
							</ClayList.ItemField>
						</ClayList.Item>
					);
				})}
			</ClayList>

			{openEntityKey && (
				<SalesforceSyncFieldsModal
					catalog={catalog}
					dataSourceId={dataSourceId}
					entityKey={openEntityKey}
					groupId={groupId}
					initialSelection={Object.fromEntries(
						(SYNC_FIELDS_ENTITIES[openEntityKey]?.tabs ?? []).map(
							(tab) => [
								tab.catalogKey,
								fieldSelection[tab.catalogKey] ?? [],
							]
						)
					)}
					onClose={() => setOpenEntityKey(null)}
					onDone={(entitySelection) => {
						const nextFieldSelection = {
							...fieldSelection,
							...entitySelection,
						};

						setFieldSelection(nextFieldSelection);

						onFieldSelectionChange?.(nextFieldSelection);
					}}
				/>
			)}
		</div>
	);
};

export default SalesforceSyncItems;

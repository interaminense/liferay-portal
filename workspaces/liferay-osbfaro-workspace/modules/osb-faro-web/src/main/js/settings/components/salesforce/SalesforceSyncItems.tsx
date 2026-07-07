import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import ClayList from '@clayui/list';
import ClaySticker from '@clayui/sticker';
import React from 'react';
import {sub} from 'shared/util/lang';
import {toThousands} from 'shared/util/numbers';

interface ISyncItem {
	description: string;
	icon: string;
	key: string;
	title: string;
}

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
	disabled?: boolean;
	itemsSelectedCounts?: Record<string, number>;
	itemsSyncedCounts?: Record<string, number>;
	onSelect: (key: string) => void;
}

const SalesforceSyncItems: React.FC<ISalesforceSyncItemsProps> = ({
	disabled = false,
	itemsSelectedCounts,
	itemsSyncedCounts,
	onSelect,
}) => (
	<div className="pt-1">
		<ClayList className="mb-0">
			{SYNC_ITEMS.map(({description, icon, key, title}) => {
				const selectedCount = itemsSelectedCounts?.[key] ?? 0;

				const countText = sub(
					Liferay.Language.get('x-items-selected'),
					[selectedCount]
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

							<ClayList.ItemText>{description}</ClayList.ItemText>

							<ClayList.ItemText>
								{itemsSyncedCounts
									? `${countText} | ${sub(
											Liferay.Language.get(
												'x-items-synced'
											),
											[
												toThousands(
													itemsSyncedCounts[key] ?? 0
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
								onClick={() => onSelect(key)}
								size="sm"
							>
								{Liferay.Language.get('select')}
							</ClayButton>
						</ClayList.ItemField>
					</ClayList.Item>
				);
			})}
		</ClayList>
	</div>
);

export default SalesforceSyncItems;

/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayDropdown from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import React, {useState} from 'react';

interface IChartsAndTableViewProps {
	chartsView: JSX.Element;
	tableView: JSX.Element;
}

type DropdownItem = {
	component: JSX.Element;
	icon: string;
	name: string;
};

const ChartsAndTableView: React.FC<IChartsAndTableViewProps> = ({
	chartsView,
	tableView,
}) => {
	const dropdownItems: DropdownItem[] = [
		{
			component: chartsView,
			icon: 'analytics',
			name: 'Chart',
		},
		{
			component: tableView,
			icon: 'table',
			name: 'Table',
		},
	];

	const [selectedItem, setSelectedItem] = useState(dropdownItems[0]);
	const [dropdownActive, setDropdownActive] = useState(false);

	return (
		<>
			<div className="align-items-center d-flex justify-content-around mt-3">
				<span className="text-3 text-nowrap text-secondary">
					{Liferay.Language.get(
						'total-number-of-times-an-asset-is-seen-by-visitors'
					)}
				</span>

				<ClayDropdown
					active={dropdownActive}
					closeOnClickOutside={true}
					onActiveChange={setDropdownActive}
					trigger={
						<ClayButton
							aria-label={selectedItem.name}
							borderless={true}
							displayType="secondary"
							onClick={() => {
								setDropdownActive(!dropdownActive);
							}}
							size="sm"
						>
							{selectedItem.icon && (
								<ClayIcon symbol={selectedItem.icon} />
							)}

							<ClayIcon className="mx-2" symbol="caret-bottom" />
						</ClayButton>
					}
				>
					{dropdownItems.map((item) => (
						<ClayDropdown.Item
							active={item.name === selectedItem.name}
							key={item.name}
							onClick={() => {
								setSelectedItem(item);
								setDropdownActive(false);
							}}
						>
							{item.icon && (
								<ClayIcon className="mr-2" symbol={item.icon} />
							)}

							{item.name}
						</ClayDropdown.Item>
					))}
				</ClayDropdown>
			</div>
			<main className="mt-3">{selectedItem.component}</main>
		</>
	);
};
export {ChartsAndTableView};

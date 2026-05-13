/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo, useState} from 'react';

import {PropertyGroup} from '../utils/types';
import {SidebarItem} from './SidebarItem';

interface ICriteriaSidebarProps {
	propertyGroups: PropertyGroup[];
}

export const CriteriaSidebar = ({propertyGroups}: ICriteriaSidebarProps) => {
	const [search, setSearch] = useState('');

	const filteredGroups = useMemo(() => {
		const needle = search.trim().toLowerCase();

		if (!needle) {
			return propertyGroups;
		}

		return propertyGroups
			.map((group) => ({
				...group,
				properties: group.properties.filter((p) =>
					p.label.toLowerCase().includes(needle)
				),
			}))
			.filter((group) => group.properties.length);
	}, [propertyGroups, search]);

	return (
		<aside className="criteria-sidebar">
			<div className="criteria-sidebar-search">
				<input
					aria-label={Liferay.Language.get('search')}
					className="form-control"
					onChange={(event) => setSearch(event.target.value)}
					placeholder={Liferay.Language.get('search')}
					type="search"
					value={search}
				/>
			</div>

			{filteredGroups.map((group) => (
				<div className="criteria-sidebar-group" key={group.propertyKey}>
					<h4 className="criteria-sidebar-group-label">
						{group.label}
					</h4>

					<div className="criteria-sidebar-group-items">
						{group.properties.map((property) => (
							<SidebarItem
								key={property.name}
								property={property}
							/>
						))}
					</div>
				</div>
			))}

			{!filteredGroups.length && (
				<div className="criteria-sidebar-empty">
					{Liferay.Language.get('no-results-were-found')}
				</div>
			)}
		</aside>
	);
};

/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Option, Picker} from '@clayui/core';
import ClayDropDown from '@clayui/drop-down';
import EmptyState from '@clayui/empty-state';
import {ClayPaginationWithBasicItems} from '@clayui/pagination';
import {PaginationBar} from '@clayui/pagination-bar';
import React, {useEffect, useMemo, useState} from 'react';

import {Catalog, CatalogItem, CatalogSection} from '../types';
import CriteriaSidebarItem from './CriteriaSidebarItem';
import CriteriaSidebarSearchBar from './CriteriaSidebarSearchBar';

interface IPickerGroup {
	items: Array<{label: string; value: string}>;
	label: string;
}

interface ICriteriaSidebarProps {
	catalog: Catalog;
	title?: string;
}

const buildPickerGroups = (
	sections: ReadonlyArray<CatalogSection>
): IPickerGroup[] => {
	const groupedByLabel = new Map<
		string,
		{items: Array<{label: string; value: string}>; order: number}
	>();
	const ungrouped: Array<{label: string; value: string}> = [];

	sections.forEach((section) => {
		const entry = {label: section.label, value: section.key};

		if (section.group) {
			const existing = groupedByLabel.get(section.group.label);
			const order = section.group.order ?? Number.MAX_SAFE_INTEGER;

			if (existing) {
				existing.items.push(entry);

				if (order < existing.order) {
					existing.order = order;
				}
			}
			else {
				groupedByLabel.set(section.group.label, {
					items: [entry],
					order,
				});
			}
		}
		else {
			ungrouped.push(entry);
		}
	});

	const groups: IPickerGroup[] = Array.from(groupedByLabel.entries())
		.sort(([, a], [, b]) => a.order - b.order)
		.map(([label, {items}]) => ({items, label}));

	if (ungrouped.length) {
		groups.push({items: ungrouped, label: ''});
	}

	return groups;
};

const filterItemsBySearch = (
	items: ReadonlyArray<CatalogItem>,
	searchValue: string
): CatalogItem[] => {
	if (!searchValue) {
		return [...items];
	}

	const needle = searchValue.toLowerCase();

	return items.filter((item) => item.label.toLowerCase().includes(needle));
};

const CriteriaSidebar: React.FC<ICriteriaSidebarProps> = ({catalog, title}) => {
	const sections = catalog.sections;

	const [selectedSectionKey, setSelectedSectionKey] = useState<string | null>(
		() => sections[0]?.key ?? null
	);

	const [searchValue, setSearchValue] = useState('');

	const [remotePage, setRemotePage] = useState(1);
	const [remoteItems, setRemoteItems] = useState<ReadonlyArray<CatalogItem>>(
		[]
	);
	const [remoteTotalCount, setRemoteTotalCount] = useState(0);

	const selectedSection = useMemo(
		() => sections.find((s) => s.key === selectedSectionKey),
		[sections, selectedSectionKey]
	);

	const isRemoteSection = !!selectedSection?.search;
	const remotePageSize = selectedSection?.search?.pageSize ?? 0;

	useEffect(() => {
		setRemoteItems([]);
		setRemoteTotalCount(0);
		setRemotePage(1);
		setSearchValue('');
	}, [selectedSectionKey]);

	useEffect(() => {
		if (!isRemoteSection || !selectedSection?.search) {
			return;
		}

		let cancelled = false;

		selectedSection.search
			.onSearch(searchValue, remotePage)
			.then((result) => {
				if (cancelled) {
					return;
				}

				setRemoteItems(result.items ?? []);
				setRemoteTotalCount(result.totalCount ?? 0);
			});

		return () => {
			cancelled = true;
		};
	}, [isRemoteSection, selectedSection, searchValue, remotePage]);

	const pickerGroups = useMemo(() => buildPickerGroups(sections), [sections]);

	const renderEmptyState = () => {
		if (selectedSection?.emptyState && !searchValue) {
			return selectedSection.emptyState;
		}

		return (
			<div className="ac-segment-builder-web__empty-message">
				<EmptyState
					className="text-center"
					description={Liferay.Language.get(
						'review-your-search-and-try-again'
					)}
					title={Liferay.Language.get('no-results-found')}
				/>
			</div>
		);
	};

	const renderSubgroups = () => {
		if (!selectedSection) {
			return null;
		}

		if (isRemoteSection) {
			if (!remoteItems.length && searchValue) {
				return renderEmptyState();
			}

			return (
				<ul className="ac-segment-builder-web__properties-list">
					{remoteItems.map((item, i) => (
						<CriteriaSidebarItem
							className={`ac-segment-builder-web__sidebar-item--color-${
								item.metadata?.colorKey ?? ''
							}`}
							item={item}
							key={`${item.name}-${i}`}
						/>
					))}
				</ul>
			);
		}

		const subgroupsWithFiltered = selectedSection.subgroups
			.map((sg) => ({
				...sg,
				items: filterItemsBySearch(sg.items, searchValue),
			}))
			.filter((sg) => !!sg.items.length);

		if (!subgroupsWithFiltered.length) {
			return renderEmptyState();
		}

		return (
			<ul className="ac-segment-builder-web__property-subgroups-list active">
				{subgroupsWithFiltered.map(({items, label}, i) => (
					<li key={`${label ?? ''}-${i}`}>
						{label && (
							<div className="ac-segment-builder-web__property-subgroup-label">
								{label}
							</div>
						)}

						<ul className="ac-segment-builder-web__properties-list">
							{items.map((item, j) => (
								<CriteriaSidebarItem
									className={`ac-segment-builder-web__sidebar-item--color-${
										item.metadata?.colorKey ?? ''
									}`}
									item={item}
									key={`${item.name}-${j}`}
								/>
							))}
						</ul>
					</li>
				))}
			</ul>
		);
	};

	return (
		<div className="ac-segment-builder-web__sidebar">
			{title && (
				<div className="ac-segment-builder-web__sidebar-title">
					{title}
				</div>
			)}

			<div className="ac-segment-builder-web__sidebar-header">
				<Picker
					items={pickerGroups}
					onSelectionChange={(key) =>
						setSelectedSectionKey(key as string)
					}
					selectedKey={selectedSectionKey ?? undefined}
				>
					{(group: IPickerGroup) => (
						<ClayDropDown.Group
							header={group.label}
							items={group.items}
						>
							{(item: {label: string; value: string}) => (
								<Option key={item.value}>{item.label}</Option>
							)}
						</ClayDropDown.Group>
					)}
				</Picker>
			</div>

			<div className="ac-segment-builder-web__sidebar-search">
				<CriteriaSidebarSearchBar
					onChange={setSearchValue}
					searchValue={searchValue}
				/>
			</div>

			<div className="ac-segment-builder-web__sidebar-collapse">
				{renderSubgroups()}
			</div>

			{isRemoteSection && remoteTotalCount > remotePageSize && (
				<PaginationBar className="ac-segment-builder-web__sidebar-pagination justify-content-center">
					<ClayPaginationWithBasicItems
						active={remotePage}
						onActiveChange={setRemotePage}
						totalPages={Math.ceil(
							remoteTotalCount / remotePageSize
						)}
					/>
				</PaginationBar>
			)}
		</div>
	);
};

export default CriteriaSidebar;

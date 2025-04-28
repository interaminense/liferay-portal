/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import {Text} from '@clayui/core';
import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import React, {useState} from 'react';

import {BaseCard} from './BaseCard';
import {FilterDropdown} from './FilterDropdown';

const VIEWS_ASSETS_VOLUME_CELL_RENDERER = 'ViewsAssetsVolumeCellRenderer';

const ViewsAssetsVolumeCellRenderer = ({
	itemData,
}: {
	itemData: {percentage: number; volume: number};
}) => {
	return (
		<div className="cms-dashboard__inventory-analysis__bar-chart">
			<div
				className="cms-dashboard__inventory-analysis__bar-chart__bar"
				style={{width: `${itemData.percentage}%`}}
			/>

			<div className="cms-dashboard__inventory-analysis__bar-chart__value">
				<Text size={3} weight="semi-bold">
					{itemData.volume}
				</Text>
			</div>
		</div>
	);
};

const structureTypes = [
	{
		label: Liferay.Language.get('structure-type'),
		value: 'all',
	},
	{
		label: Liferay.Language.get('structure-02'),
		value: 'structure02',
	},
];

const structures = [
	{
		label: Liferay.Language.get('all-structure'),
		value: 'all',
	},
	{
		label: Liferay.Language.get('structure-02'),
		value: 'structure02',
	},
];

const vocabularies = [
	{
		label: Liferay.Language.get('all-vocabularies'),
		value: 'all',
	},
	{
		label: Liferay.Language.get('vocabulary-02'),
		value: 'vocabulary02',
	},
];

const categories = [
	{
		label: Liferay.Language.get('all-categories'),
		value: 'all',
	},
	{
		label: Liferay.Language.get('category-02'),
		value: 'category02',
	},
];

const tags = [
	{
		label: Liferay.Language.get('all-tags'),
		value: 'all',
	},
	{
		label: Liferay.Language.get('tag-02'),
		value: 'tag02',
	},
];

export function InventoryAnalysisCard() {
	const [structureTypeId, setStructureTypeId] = useState(
		structureTypes[0].value
	);
	const [structureId, setStructureId] = useState(structures[0].value);
	const [vocabularyId, setVocabularyId] = useState(vocabularies[0].value);
	const [categoryId, setCategoryId] = useState(categories[0].value);
	const [tagId, setTagId] = useState(tags[0].value);

	return (
		<BaseCard
			Preferences={
				<ClayButtonWithIcon
					aria-label={Liferay.Language.get('download')}
					borderless
					displayType="secondary"
					size="sm"
					symbol="download"
				/>
			}
			description={Liferay.Language.get(
				'total-number-of-assets-grouped-by-category,-vocabulary,-tags,-structure-type-or-space'
			)}
			title={Liferay.Language.get('inventory-analysis')}
		>
			<div className="align-items-center d-flex mb-3">
				<span className="mr-2">
					<Text size={3} weight="semi-bold">
						{Liferay.Language.get('group-by')}
					</Text>
				</span>

				<FilterDropdown
					active={structureTypeId}
					filterByValue="structureTypes"
					items={structureTypes}
					onSelectItem={(structureType) =>
						setStructureTypeId(structureType.value)
					}
					triggerLabel={
						structureTypes.find(
							({value}) => value === structureTypeId
						)?.label ?? ''
					}
				/>

				<span className="ml-3 mr-2">
					<Text size={3} weight="semi-bold">
						{Liferay.Language.get('filter-by')}
					</Text>
				</span>

				<FilterDropdown
					active={structureId}
					filterByValue="structures"
					icon="edit-layout"
					items={structures}
					onSelectItem={(structure) =>
						setStructureId(structure.value)
					}
					triggerLabel={
						structures.find(({value}) => value === structureId)
							?.label ?? ''
					}
				/>

				<FilterDropdown
					active={vocabularyId}
					filterByValue="vocabularies"
					icon="vocabulary"
					items={vocabularies}
					onSelectItem={(vocabulary) =>
						setVocabularyId(vocabulary.value)
					}
					triggerLabel={
						vocabularies.find(({value}) => value === vocabularyId)
							?.label ?? ''
					}
				/>

				<FilterDropdown
					active={categoryId}
					filterByValue="categories"
					icon="categories"
					items={categories}
					onSelectItem={(category) => setCategoryId(category.value)}
					triggerLabel={
						categories.find(({value}) => value === categoryId)
							?.label ?? ''
					}
				/>

				<FilterDropdown
					active={tagId}
					filterByValue="tags"
					icon="tag"
					items={tags}
					onSelectItem={(tag) => setTagId(tag.value)}
					triggerLabel={
						tags.find(({value}) => value === tagId)?.label ?? ''
					}
				/>
			</div>

			<FrontendDataSet
				customRenderers={{
					tableCell: [
						{
							component: ViewsAssetsVolumeCellRenderer,
							name: VIEWS_ASSETS_VOLUME_CELL_RENDERER,
							type: 'internal',
						},
					],
				}}
				id="inventoryAnalysisDataSet"
				items={[
					{
						percentage: 65,
						title: 'title 1',
						volume: 150,
					},
					{
						percentage: 26,
						title: 'title 2',
						volume: 2540,
					},
					{
						percentage: 72,
						title: 'title 3',
						volume: 40,
					},
					{
						percentage: 50,
						title: 'title 4',
						volume: 342,
					},
					{
						percentage: 100,
						title: 'title 5',
						volume: 100,
					},
				]}
				showManagementBar={false}
				showPagination={true}
				showSearch={false}
				style="stacked"
				views={[
					{
						contentRenderer: 'table',
						label: Liferay.Language.get('table'),
						name: 'table',
						schema: {
							fields: [
								{
									fieldName: 'title',
									label: Liferay.Language.get(
										'structure-title'
									),
									sortable: true,
								},
								{
									contentRenderer:
										VIEWS_ASSETS_VOLUME_CELL_RENDERER,
									expand: true,
									fieldName: 'volume',
									label: Liferay.Language.get(
										'assets-volume'
									),
									sortable: false,
								},
								{
									fieldName: 'percentage',
									label: Liferay.Language.get('%-of-assets'),
									sortable: false,
								},
							],
						},
						thumbnail: 'table',
					},
				]}
			/>
		</BaseCard>
	);
}

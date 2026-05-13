/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useEffect, useMemo, useState} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import {fetchPropertyGroups} from './builder/api/fields';
import {CriteriaBuilder} from './builder/criteria-builder/CriteriaBuilder';
import {CriteriaSidebar} from './builder/criteria-sidebar/CriteriaSidebar';
import {buildQueryString} from './builder/utils/odata';
import {CriterionGroup, PropertyGroup} from './builder/utils/types';
import {wrapInCriteriaGroup} from './builder/utils/utils';

export const App = () => {
	const [criteria, setCriteria] = useState<CriterionGroup>(() =>
		wrapInCriteriaGroup([])
	);
	const [propertyGroups, setPropertyGroups] = useState<PropertyGroup[] | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		fetchPropertyGroups()
			.then((groups) => {
				if (!cancelled) {
					setPropertyGroups(groups);
				}
			})
			.catch((err) => {
				if (!cancelled) {
					setError(err?.message || String(err));
				}
			});

		return () => {
			cancelled = true;
		};
	}, []);

	const criteriaString = useMemo(
		() => buildQueryString([criteria]),
		[criteria]
	);

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="analytics-segments-builder">
				<div className="analytics-segments-builder-layout">
					{error ? (
						<div className="alert alert-danger">
							{Liferay.Language.get(
								'an-unexpected-error-occurred'
							)}{' '}
							<small>{error}</small>
						</div>
					) : propertyGroups === null ? (
						<div className="analytics-segments-builder-loading">
							{Liferay.Language.get('loading')}
						</div>
					) : (
						<>
							<CriteriaSidebar propertyGroups={propertyGroups} />

							<div className="analytics-segments-builder-main">
								<h3>
									{Liferay.Language.get(
										'analytics-segments-builder-poc'
									)}
								</h3>

								<CriteriaBuilder
									criteria={criteria}
									onChange={setCriteria}
								/>

								<div className="analytics-segments-builder-output">
									<label className="analytics-segments-builder-output-label">
										{Liferay.Language.get(
											'generated-criteria-odata'
										)}
									</label>

									<pre className="analytics-segments-builder-output-pre">
										{criteriaString || (
											<span className="text-muted">
												{Liferay.Language.get(
													'drop-a-property-to-build-a-criterion'
												)}
											</span>
										)}
									</pre>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</DndProvider>
	);
};

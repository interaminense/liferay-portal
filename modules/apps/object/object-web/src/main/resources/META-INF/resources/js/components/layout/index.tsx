/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayButton from '@clayui/button';
import {ClayIconSpriteContext} from '@clayui/icon';
import ClayTabs from '@clayui/tabs';
import React, {useContext, useEffect, useState} from 'react';

import useLiferayFech from '../../hooks/useLiferayFetch';
import SidePanelContent from '../SidePanelContent';
import InfoScreen from './InfoScreen/InfoScreen';
import LayoutScreen from './LayoutScreen/LayoutScreen';
import LayoutContext, {LayoutContextProvider, TYPES} from './context';
import layoutData from './data';

const TABS = [
	{
		Component: InfoScreen,
		label: Liferay.Language.get('info'),
	},
	{
		Component: LayoutScreen,
		label: Liferay.Language.get('layout'),
	},
];

const Layout: React.FC<React.HTMLAttributes<HTMLElement>> = () => {
	const [{objectDefinitionId}, dispatch] = useContext(LayoutContext);
	const [activeIndex, setActiveIndex] = useState<number>(0);

	useEffect(() => {
		dispatch({
			payload: {layoutData},
			type: TYPES.ADD_LAYOUT_DATA,
		});
	}, [dispatch]);

	useEffect(() => {
		const makeFetch = async () => {
			const response = await Liferay.Util.fetch(`/o/object-admin/v1.0/object-definitions/${objectDefinitionId}/object-fields`, {
				headers: new Headers({
					Accept: 'application/json',
					'Content-Type': 'application/json',
				}),
				method: 'GET',
			});

			const {items = []} = await response.json();

			dispatch({
				payload: {objectFields: items},
				type: TYPES.ADD_OBJECT_FIELDS,
			});
		};

		makeFetch();
	}, [objectDefinitionId, dispatch]);

	return (
		<>
			<ClayTabs className="side-panel-iframe__tabs">
				{TABS.map(({label}, index) => (
					<ClayTabs.Item
						active={activeIndex === index}
						key={index}
						onClick={() => setActiveIndex(index)}
					>
						{label}
					</ClayTabs.Item>
				))}
			</ClayTabs>

			<SidePanelContent>
				<SidePanelContent.Body>
					<ClayTabs.Content activeIndex={activeIndex} fade>
						{TABS.map(({Component}, index) => (
							<ClayTabs.TabPane key={index}>
								<Component />
							</ClayTabs.TabPane>
						))}
					</ClayTabs.Content>
				</SidePanelContent.Body>

				<SidePanelContent.Footer>
					<ClayButton.Group spaced>
						<ClayButton displayType="secondary">
							{Liferay.Language.get('cancel')}
						</ClayButton>
						<ClayButton>{Liferay.Language.get('save')}</ClayButton>
					</ClayButton.Group>
				</SidePanelContent.Footer>
			</SidePanelContent>
		</>
	);
};

interface ILayoutWrapperProps extends React.HTMLAttributes<HTMLElement> {
	objectDefinitionId: string;
	spritemap: string;
}

const LayoutWrapper: React.FC<ILayoutWrapperProps> = ({
	objectDefinitionId,
	spritemap,
}) => {
	return (
		<ClayIconSpriteContext.Provider value={spritemap}>
			<LayoutContextProvider value={{objectDefinitionId}}>
				<Layout />
			</LayoutContextProvider>
		</ClayIconSpriteContext.Provider>
	);
};

export default LayoutWrapper;

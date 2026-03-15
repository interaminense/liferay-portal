import Card from 'shared/components/Card';
import ClayLink from '@clayui/link';
import ClayNavigationBar from '@clayui/navigation-bar';
import React, {PropsWithChildren, useState} from 'react';
import {getMatchedRoute, Routes as Path, toRoute} from 'shared/util/router';

const NAV_ITEMS = [
	{
		label: Liferay.Language.get('global-attributes'),
		route: Path.SETTINGS_DEFINITIONS_EVENT_ATTRIBUTES_GLOBAL
	},
	{
		label: Liferay.Language.get('attributes'),
		route: Path.SETTINGS_DEFINITIONS_EVENT_ATTRIBUTES_LOCAL
	}
];

interface ITabsCardProps {
	groupId: string;
}

const TabsCard: React.FC<PropsWithChildren<ITabsCardProps>> = ({
	children,
	groupId
}) => {
	const matchedRoute = getMatchedRoute(NAV_ITEMS);

	const initialItem =
		NAV_ITEMS.find(item => item.route === matchedRoute) ?? NAV_ITEMS[0];

	const [activeLabel, setActiveLabel] = useState(initialItem.label);

	return (
		<Card key='cardContainer' pageDisplay>
			<ClayNavigationBar
				className='page-subnav mx-4 my-3'
				triggerLabel={activeLabel}
			>
				{NAV_ITEMS.map(({label, route}) => (
					<ClayNavigationBar.Item
						active={matchedRoute === route}
						key={route}
					>
						<ClayLink
							href={toRoute(route, {groupId})}
							onClick={() => setActiveLabel(label)}
						>
							{label}
						</ClayLink>
					</ClayNavigationBar.Item>
				))}
			</ClayNavigationBar>

			{children}
		</Card>
	);
};
export default TabsCard;

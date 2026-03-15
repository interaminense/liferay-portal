import Card from 'shared/components/Card';
import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import ClayNavigationBar from '@clayui/navigation-bar';
import React, {PropsWithChildren, useState} from 'react';
import {getMatchedRoute, Routes as Path, toRoute} from 'shared/util/router';

const NAV_ITEMS = [
	{
		label: Liferay.Language.get('default-events'),
		route: Path.SETTINGS_DEFINITIONS_EVENTS_DEFAULT
	},
	{
		label: Liferay.Language.get('custom-events'),
		route: Path.SETTINGS_DEFINITIONS_EVENTS_CUSTOM
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

	const customEventTab =
		matchedRoute === Path.SETTINGS_DEFINITIONS_EVENTS_CUSTOM;

	const initialItem =
		NAV_ITEMS.find(item => item.route === matchedRoute) ?? NAV_ITEMS[0];

	const [activeLabel, setActiveLabel] = useState(initialItem.label);

	return (
		<Card key='cardContainer' pageDisplay>
			<ClayNavigationBar className='my-3' triggerLabel={activeLabel}>
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

			{customEventTab && (
				<ClayLink
					borderless
					button
					className='block-list-button button-root m-3'
					displayType='secondary'
					href={toRoute(Path.SETTINGS_DEFINITIONS_EVENTS_BLOCK_LIST, {
						groupId
					})}
					small
				>
					<ClayIcon className='icon-root mr-2' symbol='ac_block' />

					{Liferay.Language.get('block-list')}
				</ClayLink>
			)}

			{children}
		</Card>
	);
};

export default TabsCard;

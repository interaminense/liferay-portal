import BundleRouter from 'route-middleware/BundleRouter';
import Settings from 'settings/pages/Settings';
import React from 'react';
import SectionApp from './SectionApp';

interface ISettingsAppProps {
	channelId: string;
	groupId: string;
}

const SettingsApp: React.FC<ISettingsAppProps> = (props) => (
	<SectionApp
		{...props}
		channelScoped={false}
		path="settings/data-source"
		routes={[
			{
				element: <BundleRouter data={Settings} />,
				path: 'settings/*',
			},
		]}
	/>
);

export default SettingsApp;

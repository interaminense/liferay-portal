import ErrorPage from 'shared/pages/ErrorPage';
import React, {useEffect} from 'react';
import {Channel} from 'shared/components/channels-menu';
import {getDefaultChannel} from 'shared/components/channels-menu';
import {matchPath, useNavigate} from 'react-router';
import {Routes, toRoute} from 'shared/util/router';

type Location = {
	pathname: string;
};

interface IWrappedComponentProps {
	channelId: string;
	channels: Array<Channel>;
	defaultChannelId: string;
	groupId: string;
	location: Location;
	navigate: (path: string) => void;
}

const checkValidChannel = (
	WrappedComponent: React.ComponentType<IWrappedComponentProps>
) => ({
	channelId,
	channels,
	defaultChannelId,
	groupId,
	location,
	...otherProps
}) => {
	const navigate = useNavigate();

	useEffect(() => {
		const isHome = matchPath(Routes.WORKSPACE_WITH_ID, location.pathname);

		if (isHome) {
			const channel = getDefaultChannel(defaultChannelId, channels);

			navigate(
				toRoute(Routes.SITES, {
					...(channel && {channelId: channel.id}),
					groupId
				}),
				{replace: true}
			);
		}
	}, []);

	if (
		channelId &&
		!!channels.length &&
		!channels.some(({id}) => id === channelId)
	) {
		return <ErrorPage />;
	}

	return (
		<WrappedComponent
			{...otherProps}
			channelId={channelId}
			channels={channels}
			defaultChannelId={channelId}
			groupId={groupId}
			navigate={navigate}
			location={location}
		/>
	);
};

export default checkValidChannel;

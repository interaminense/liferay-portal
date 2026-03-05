import React, {useEffect} from 'react';
import {BrowserRouter, Link, Route, Routes, useParams} from 'react-router';

import {ApolloProvider} from '@apollo/client/react';
import {Provider} from 'react-redux';
import {ClayIconSpriteContext} from '@clayui/icon';
import {ClayLinkContext} from '@clayui/link';
import {ClayTooltipProvider} from '@clayui/tooltip';

import client from 'shared/apollo/client';
import store from 'shared/store';

import ChannelProvider from 'shared/context/channel';
import UnassignedSegmentsProvider from 'shared/context/unassignedSegments';
import {useCurrentUser, useFetchCurrentUser} from 'shared/hooks/useCurrentUser';
import {fetchProject} from 'shared/actions/projects';
import {useFetchProjects} from 'shared/hooks/useProjects';
import BundleRouter from 'route-middleware/BundleRouter';
import {Routes as Path} from 'shared/util/router';
import Workspaces from 'shared/pages/Workspaces';

const AppRoutes = () => {
	// useFetchCurrentUser();

	// const projects = useFetchProjects();

	// console.log(projects);

	return (
		<Routes>
			<Route
				path='/'
				element={<BundleRouter data={Workspaces} path={Path.BASE} />}
			/>
		</Routes>
	);
};

// const Workspaces = () => {
// 	const currentUser = useCurrentUser();

// 	console.log({currentUserFromWP: currentUser});

// 	return <div>workspaces</div>;
// };

// const WorkspaceWithId = () => {
// 	const {workspaceId} = useParams();

// 	useEffect(() => {
// 		if (workspaceId) {
// 			store.dispatch(fetchProject({groupId: workspaceId}));
// 		}
// 	}, [workspaceId]);

// 	return <div>workspace with id {workspaceId}</div>;
// };

const App = () => {
	return (
		<ApolloProvider client={client}>
			<Provider store={store}>
				<ClayIconSpriteContext.Provider value='/o/osb-faro-web/dist/sprite.svg'>
					<ClayLinkContext.Provider
						value={({
							children,
							externalLink = false,
							href,
							...otherProps
						}: any) => {
							if (href?.startsWith('http') || externalLink) {
								return (
									<a {...otherProps} href={href}>
										{children}
									</a>
								);
							}
							return (
								<Link {...otherProps} to={href || ''}>
									{children}
								</Link>
							);
						}}
					>
						<UnassignedSegmentsProvider>
							<ChannelProvider>
								<ClayTooltipProvider>
									<BrowserRouter>
										<AppRoutes />
									</BrowserRouter>
								</ClayTooltipProvider>
							</ChannelProvider>
						</UnassignedSegmentsProvider>
					</ClayLinkContext.Provider>
				</ClayIconSpriteContext.Provider>
			</Provider>
		</ApolloProvider>
	);
};

export default App;

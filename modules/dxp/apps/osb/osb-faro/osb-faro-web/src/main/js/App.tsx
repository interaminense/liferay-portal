import React, {Suspense, useEffect, useState} from 'react';
import {
	BrowserRouter,
	Link,
	Outlet,
	Route,
	Routes,
	useParams
} from 'react-router';

import {ApolloProvider} from '@apollo/client/react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {ClayIconSpriteContext} from '@clayui/icon';
import {ClayLinkContext} from '@clayui/link';
import {ClayTooltipProvider} from '@clayui/tooltip';

import client from 'shared/apollo/client';
import store, {RootState} from 'shared/store';

import ChannelProvider from 'shared/context/channel';
import UnassignedSegmentsProvider from 'shared/context/unassignedSegments';
import {useCurrentUser, useFetchCurrentUser} from 'shared/hooks/useCurrentUser';
import {fetchProject, fetchProjects} from 'shared/actions/projects';
import {useFetchProjects} from 'shared/hooks/useProjects';
import BundleRouter from 'route-middleware/BundleRouter';
import {Routes as Path} from 'shared/util/router';
import Workspaces from 'shared/pages/Workspaces';
import {User} from 'shared/util/records';
import {fetchCurrentUser} from 'shared/actions/users';
import AddWorkspace from 'shared/pages/AddWorkspace';
import WorkspaceLayer from 'shared/components/WorkspaceLayer';
import Settings from 'settings/pages/Settings';
import AppSidebarRoutes from 'shared/pages/AppSidebarRoutes';
import {OnboardingContext} from 'shared/context/onboarding';
import Loading from 'shared/components/Loading';
import {throttle} from 'lodash';
import {saveState} from 'shared/store/local-storage';

const AppSetup = () => {
	const dispatch = useDispatch();
	const {groupId} = useParams();

	useEffect(() => {
		dispatch(fetchCurrentUser(groupId ?? '0'));

		/**
		 * TODO: Conseguir armazenar os projects ou project no redux store
		 * Depois ir em AppSidebarRoutes e corrigir as rotas
		 */

		if (groupId) {
			dispatch(fetchProject({groupId}));
		}
	}, [groupId]);

	return <Outlet />;
};

const AppRoutes = () => {
	return (
		<Routes>
			<Route element={<AppSetup />}>
				<Route
					path={Path.BASE}
					element={
						<BundleRouter data={Workspaces} path={Path.BASE} />
					}
				/>

				<Route
					path={Path.WORKSPACE_ADD_TRIAL}
					element={
						<BundleRouter
							data={AddWorkspace}
							path={Path.WORKSPACE_ADD_TRIAL}
						/>
					}
				/>

				<Route
					path={Path.WORKSPACE_ADD_WITH_CORP_PROJECT_UUID}
					element={
						<BundleRouter
							data={AddWorkspace}
							path={Path.WORKSPACE_ADD_TRIAL}
						/>
					}
				/>

				<Route element={<WorkspaceLayer />}>
					<Route
						path={Path.SETTINGS}
						element={
							<BundleRouter
								data={Settings}
								path={Path.SETTINGS}
							/>
						}
					/>

					<Route
						path={Path.WORKSPACE_WITH_ID}
						element={
							<BundleRouter
								data={AppSidebarRoutes}
								path={Path.CHANNEL}
							/>
						}
					/>
				</Route>

				<Route path='/test/*' element={<SubRoutes />} />
			</Route>
		</Routes>
	);
};

const Test = () => {
	return <div>test 123</div>;
};

const SubRoutes = () => {
	return (
		<>
			<h1>test</h1>

			<Routes>
				<Route path='/test/bar' element={<Test />} />
			</Routes>
		</>
	);
};

const App = () => {
	const [onboardingTriggered, setOnboardingTriggered] = useState(false);

	useEffect(() => {
		/**
		 * Store maintenanceSeen and sidebar states
		 */
		store.subscribe(throttle(() => saveState(store.getState()), 1000));
	}, []);

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
							<OnboardingContext.Provider
								value={{
									onboardingTriggered,
									setOnboardingTriggered: () =>
										setOnboardingTriggered(true)
								}}
							>
								<ChannelProvider>
									<ClayTooltipProvider>
										<BrowserRouter>
											<Suspense fallback={<Loading />}>
												<AppRoutes />
											</Suspense>
										</BrowserRouter>
									</ClayTooltipProvider>
								</ChannelProvider>
							</OnboardingContext.Provider>
						</UnassignedSegmentsProvider>
					</ClayLinkContext.Provider>
				</ClayIconSpriteContext.Provider>
			</Provider>
		</ApolloProvider>
	);
};

export default App;

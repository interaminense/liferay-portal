import AddWorkspace from 'shared/pages/AddWorkspace';
import AlertFeed from 'shared/components/AlertFeed';
import AppSidebarRoutes from 'shared/pages/AppSidebarRoutes';
import BundleRouter from 'route-middleware/BundleRouter';
import ChannelProvider from 'shared/context/channel';
import client from 'shared/apollo/client';
import ErrorPage from 'shared/pages/ErrorPage';
import Loading from 'shared/components/Loading';
import ModalRenderer from 'shared/components/ModalRenderer';
import OAuthReceive from 'settings/pages/OAuthReceive';
import SelectWorkspaceAccount from 'shared/pages/SelectWorkspaceAccount';
import Settings from 'settings/pages/Settings';
import store, {RootState} from 'shared/store';
import UnassignedSegmentsProvider from 'shared/context/unassignedSegments';
import WorkspaceLayer from 'shared/components/WorkspaceLayer';
import Workspaces from 'shared/pages/Workspaces';
import {ApolloProvider} from '@apollo/client/react';
import {
	BrowserRouter,
	Link,
	Outlet,
	Route,
	Routes,
	useLocation,
	useParams
} from 'react-router';
import {ClayIconSpriteContext} from '@clayui/icon';
import {ClayLinkContext} from '@clayui/link';
import {ClayTooltipProvider} from '@clayui/tooltip';
import {ENABLE_ADD_TRIAL_WORKSPACE} from 'shared/util/constants';
import {OnboardingContext} from 'shared/context/onboarding';
import {Routes as Path} from 'shared/util/router';
import {Pendo} from 'shared/util/pendo';
import {Project} from 'shared/util/records';
import {Provider, useSelector} from 'react-redux';
import {saveState} from 'shared/store/local-storage';
import {Suspense, useEffect, useState} from 'react';
import {throttle} from 'lodash';
import {useFetchCurrentUser} from 'shared/hooks/useCurrentUser';

const RoutesContainer = () => {
	const {groupId} = useParams();
	const location = useLocation();

	const project: Project = useSelector((state: RootState) =>
		state.getIn(['projects', groupId, 'data'])
	);

	const {data: currentUser, loading} = useFetchCurrentUser(groupId);

	useEffect(() => {
		if (currentUser?.id && project?.corpProjectName) {
			const pendo = new Pendo();

			pendo.initialize({currentUser, project});
		}
	}, [currentUser?.id, project?.corpProjectName]);

	if (loading) {
		return <Loading />;
	}

	if (location?.state?.notFoundError) {
		return <ErrorPage />;
	}

	return (
		<>
			<AlertFeed />

			<ModalRenderer />

			<Outlet />
		</>
	);
};

const AppRoutes = () => (
	<Routes>
		<Route element={<RoutesContainer />}>
			<Route
				element={<BundleRouter data={Workspaces} path={Path.BASE} />}
				path={Path.BASE}
			/>

			<Route
				element={
					<BundleRouter data={Workspaces} path={Path.WORKSPACES} />
				}
				path={Path.WORKSPACES}
			/>

			<Route
				element={
					<BundleRouter
						data={AddWorkspace}
						path={Path.WORKSPACE_ADD}
					/>
				}
				path={Path.WORKSPACE_ADD}
			/>

			<Route
				element={
					<BundleRouter
						data={SelectWorkspaceAccount}
						path={Path.WORKSPACE_ADD}
					/>
				}
				path={Path.WORKSPACE_ADD}
			/>

			<Route
				element={
					<BundleRouter
						data={SelectWorkspaceAccount}
						path={Path.WORKSPACE_SELECT_ACCOUNT}
					/>
				}
				path={Path.WORKSPACE_SELECT_ACCOUNT}
			/>

			{ENABLE_ADD_TRIAL_WORKSPACE && (
				<Route
					element={
						<BundleRouter
							data={AddWorkspace}
							path={Path.WORKSPACE_ADD_TRIAL}
						/>
					}
					path={Path.WORKSPACE_ADD_TRIAL}
				/>
			)}

			<Route
				element={
					<BundleRouter
						data={AddWorkspace}
						path={Path.WORKSPACE_ADD_WITH_CORP_PROJECT_UUID}
					/>
				}
				path={Path.WORKSPACE_ADD_WITH_CORP_PROJECT_UUID}
			/>

			<Route
				element={
					<BundleRouter
						data={OAuthReceive}
						path={Path.OAUTH_RECEIVE}
					/>
				}
				path={Path.OAUTH_RECEIVE}
			/>

			<Route element={<Loading />} path={Path.LOADING} />

			{/* <Route element={<RouteNotFound />} path='*' /> */}

			<Route element={<WorkspaceLayer />}>
				<Route
					element={
						<BundleRouter
							data={Settings}
							path={`${Path.SETTINGS}/*`}
						/>
					}
					path='/workspace/:groupId/settings/*'
				/>

				<Route
					element={
						<BundleRouter
							data={AppSidebarRoutes}
							path={`${Path.WORKSPACE_WITH_ID}/*`}
						/>
					}
					path={`${Path.WORKSPACE_WITH_ID}/*`}
				/>
			</Route>
		</Route>
	</Routes>
);

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

import AlertFeed from 'shared/components/AlertFeed';
import ChannelProvider from 'shared/context/channel';
import client from 'shared/apollo/client';
import ErrorPage from 'shared/pages/ErrorPage';
import Loading from 'shared/components/Loading';
import ModalRenderer from 'shared/components/ModalRenderer';
import React, {lazy, Suspense, useEffect, useState} from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import store from 'shared/store';
import UnassignedSegmentsProvider from 'shared/context/unassignedSegments';
import {ApolloProvider} from '@apollo/react-components';
import {ApolloProvider as ApolloProviderHooks} from '@apollo/react-hooks';
import {
	BrowserRouter,
	Link,
	matchPath,
	Outlet,
	Route,
	Routes,
	useLocation
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
import {throttle} from 'lodash';
import {useFetchCurrentUser} from 'shared/hooks/useCurrentUser';

// Workspaces

const AddWorkspace = lazy(
	() =>
		import(
			/* webpackChunkName: "AddWorkspace" */ './shared/pages/AddWorkspace'
		)
);
const SelectWorkspaceAccount = lazy(
	() =>
		import(
			/* webpackChunkName: "SelectWorkspaceAccount" */ './shared/pages/SelectWorkspaceAccount'
		)
);
const Workspaces = lazy(
	() =>
		import(/* webpackChunkName: "Workspaces" */ './shared/pages/Workspaces')
);

// WorkspaceLayer
const WorkspaceLayer = lazy(
	() =>
		import(
			/* webpackChunkName: "WorkspaceLayer" */ './shared/components/WorkspaceLayer'
		)
);

// Other

const OAuthReceive = lazy(
	() =>
		import(
			/* webpackChunkName: "OAuthReceive" */ './settings/pages/OAuthReceive'
		)
);

const RoutesContainer = () => {
	const location = useLocation();

	const matchingPath = matchPath(Path.WORKSPACE_WITH_ID, location.pathname);

	const groupId = matchingPath?.params.groupId ?? '0';

	const project: Project = useSelector<any, any>(state =>
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

const App = () => {
	const [onboardingTriggered, setOnboardingTriggered] = useState(false);

	useEffect(() => {
		store.subscribe(throttle(() => saveState(store.getState()), 1000));
	}, []);

	return (
		<ApolloProvider client={client}>
			<ApolloProviderHooks client={client}>
				<Provider store={store}>
					<ClayIconSpriteContext.Provider value='/o/osb-faro-web/dist/sprite.svg'>
						<ClayLinkContext.Provider
							value={({
								children,
								externalLink = false,
								href,
								...otherProps
							}: {
								children: React.ReactNode;
								externalLink?: boolean;
								href?: string;
							}) => {
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
											<div>
												<BrowserRouter>
													<Routes>
														<Route
															element={
																<Suspense
																	fallback={
																		<Loading />
																	}
																>
																	<RoutesContainer />
																</Suspense>
															}
														>
															<Route
																element={
																	<Workspaces />
																}
																path={Path.BASE}
															/>

															<Route
																element={
																	<Workspaces />
																}
																path={
																	Path.WORKSPACES
																}
															/>

															<Route
																element={
																	<SelectWorkspaceAccount />
																}
																path={
																	Path.WORKSPACE_ADD
																}
															/>

															{ENABLE_ADD_TRIAL_WORKSPACE && (
																<Route
																	element={
																		<Suspense
																			fallback={
																				<Loading />
																			}
																		>
																			<AddWorkspace />
																		</Suspense>
																	}
																	path={
																		Path.WORKSPACE_ADD_TRIAL
																	}
																/>
															)}

															<Route
																element={
																	<AddWorkspace />
																}
																path={
																	Path.WORKSPACE_ADD_WITH_CORP_PROJECT_UUID
																}
															/>

															<Route
																element={
																	<SelectWorkspaceAccount />
																}
																path={
																	Path.WORKSPACE_SELECT_ACCOUNT
																}
															/>

															<Route
																element={
																	<OAuthReceive />
																}
																path={
																	Path.OAUTH_RECEIVE
																}
															/>

															<Route
																element={
																	<Loading />
																}
																path={
																	Path.LOADING
																}
															/>

															<Route
																element={
																	<RouteNotFound />
																}
															/>

															<Route
																element={
																	<WorkspaceLayer />
																}
															/>
														</Route>
													</Routes>
												</BrowserRouter>
											</div>
										</ClayTooltipProvider>
									</ChannelProvider>
								</OnboardingContext.Provider>
							</UnassignedSegmentsProvider>
						</ClayLinkContext.Provider>
					</ClayIconSpriteContext.Provider>
				</Provider>
			</ApolloProviderHooks>
		</ApolloProvider>
	);
};

export default App;

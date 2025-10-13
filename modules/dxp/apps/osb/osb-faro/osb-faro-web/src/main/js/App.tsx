import AlertFeed from 'shared/components/AlertFeed';
import AppContextProvider, {AppContext} from './AppContext';
import BundleRouter from 'route-middleware/BundleRouter';
import client from 'shared/apollo/client';
import ErrorPage from 'shared/pages/ErrorPage';
import Loading from 'shared/components/Loading';
import ModalNotificationLayer from 'shared/components/ModalNotificationLayer';
import ModalRenderer from 'shared/components/ModalRenderer';
import pathToRegexp from 'path-to-regexp';
import React, {lazy, Suspense, useContext, useEffect, useState} from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import store from 'shared/store';
import UnassignedSegmentsProvider from 'shared/context/unassignedSegments';
import {ApolloProvider} from '@apollo/react-components';
import {ApolloProvider as ApolloProviderHooks} from '@apollo/react-hooks';
import {ClayIconSpriteContext} from '@clayui/icon';
import {ClayLinkContext} from '@clayui/link';
import {ClayTooltipProvider} from '@clayui/tooltip';
import {close, modalTypes, open} from 'shared/actions/modals';
import {ENABLE_ADD_TRIAL_WORKSPACE} from 'shared/util/constants';
import {fetchCurrentUser} from 'shared/api/user';
import {
	Link,
	matchPath,
	Route,
	BrowserRouter as Router,
	Switch,
	useLocation
} from 'react-router-dom';
import {Provider} from 'react-redux';
import {Routes} from 'shared/util/router';
import {saveState} from 'shared/store/local-storage';
import {setBackURL} from 'shared/actions/settings';
import {throttle} from 'lodash';

const AddWorkspace = lazy(
	() =>
		import(
			/* webpackChunkName: "AddWorkspace" */ './shared/pages/AddWorkspace'
		)
);

const Workspaces = lazy(
	() =>
		import(
			/* webpackChunkName: "Workspaces" */ './shared/pages/Workspaces'
		) as any
);

const OAuthReceive = lazy(
	() =>
		import(
			/* webpackChunkName: "OAuthReceive" */ './settings/pages/OAuthReceive'
		)
);

const AppSidebarRoutes = lazy(
	() =>
		import(
			/* webpackChunkName: "AppSidebarRoutes" */ 'shared/pages/AppSidebarRoutes'
		)
);

const Settings = lazy(
	() => import(/* webpackChunkName: "Settings" */ 'settings/pages/Settings')
);

const App = () => {
	useEffect(() => {
		const unsubscribe = store.subscribe(
			throttle(() => saveState(store.getState()), 1000)
		);

		return unsubscribe;
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
								<ClayTooltipProvider>
									<div>
										<AppContextProvider>
											<Router
												getUserConfirmation={(
													message,
													callback
												) => {
													store.dispatch(
														open(
															modalTypes.CONFIRMATION_MODAL,
															{
																cancelMessage: Liferay.Language.get(
																	'stay-on-page'
																),
																message,
																modalVariant:
																	'modal-warning',
																onClose: () => {
																	callback(
																		false
																	);

																	store.dispatch(
																		close()
																	);
																},
																onSubmit: () => {
																	callback(
																		true
																	);
																},
																submitButtonDisplay:
																	'warning',
																submitMessage: Liferay.Language.get(
																	'leave-page'
																),
																title: Liferay.Language.get(
																	'unsaved-changes'
																),
																titleIcon:
																	'warning-full'
															}
														)
													);
												}}
											>
												<AppInitializer>
													<div>
														<AlertFeed />

														<ModalRenderer />

														<Suspense
															fallback={
																<Loading />
															}
														>
															<Switch>
																<BundleRouter
																	data={
																		Workspaces
																	}
																	exact
																	path={
																		Routes.BASE
																	}
																/>

																<BundleRouter
																	data={
																		Workspaces
																	}
																	exact
																	path={
																		Routes.WORKSPACES
																	}
																/>

																{ENABLE_ADD_TRIAL_WORKSPACE && (
																	<BundleRouter
																		data={
																			AddWorkspace
																		}
																		exact
																		path={
																			Routes.WORKSPACE_ADD_TRIAL
																		}
																	/>
																)}

																<BundleRouter
																	data={
																		AddWorkspace
																	}
																	exact
																	path={
																		Routes.WORKSPACE_ADD_WITH_CORP_PROJECT_UUID
																	}
																/>

																<BundleRouter
																	data={
																		OAuthReceive
																	}
																	exact
																	path={
																		Routes.OAUTH_RECEIVE
																	}
																/>

																<Route
																	component={
																		Loading
																	}
																	path={
																		Routes.LOADING
																	}
																/>

																<BundleRouter
																	data={
																		Settings
																	}
																	path={
																		Routes.SETTINGS
																	}
																/>

																<BundleRouter
																	data={
																		AppSidebarRoutes
																	}
																	path={
																		Routes.CHANNEL
																	}
																/>

																<ModalNotificationLayer />

																<RouteNotFound />
															</Switch>
														</Suspense>
													</div>
												</AppInitializer>
											</Router>
										</AppContextProvider>
									</div>
								</ClayTooltipProvider>
							</UnassignedSegmentsProvider>
						</ClayLinkContext.Provider>
					</ClayIconSpriteContext.Provider>
				</Provider>
			</ApolloProviderHooks>
		</ApolloProvider>
	);
};

const SETTINGS_PATH_REGEX = pathToRegexp(Routes.SETTINGS, null, {end: false});

const AppInitializer = ({children}) => {
	const {setCurrentUser} = useContext(AppContext);
	const location = useLocation();
	const [loading, setLoading] = useState(true);

	const matchingPath = matchPath<any>(location.pathname, {
		path: Routes.WORKSPACE_WITH_ID
	});

	const groupId = matchingPath?.params.groupId ?? '0';

	useEffect(() => {
		// Store currentUser on Context

		async function fetch() {
			const currentUser = await fetchCurrentUser({groupId});

			console.log('currentUser', currentUser);

			setCurrentUser(currentUser);

			setLoading(false);
		}

		fetch();
	}, [groupId]);

	useEffect(() => {
		if (!SETTINGS_PATH_REGEX.test(location.pathname)) {
			store.dispatch(
				setBackURL(`${location.pathname}${location.search}`)
			);
		}
	}, [location]);

	if (loading) {
		return <Loading />;
	}

	if (location?.state?.notFoundError) {
		return <ErrorPage />;
	}

	return children;
};

export default App;

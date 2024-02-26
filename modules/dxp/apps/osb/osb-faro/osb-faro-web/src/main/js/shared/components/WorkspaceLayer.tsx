import BundleRouter from 'route-middleware/BundleRouter';
import HelpWidget from './HelpWidget';
import Loading from 'shared/components/Loading';
import React, {lazy, Suspense, useEffect} from 'react';
import RouteNotFound from './RouteNotFound';
import {matchPath} from 'react-router';
import {Routes} from 'shared/util/router';
import {Switch, useLocation} from 'react-router-dom';
import {useCurrentUser} from 'shared/hooks/useCurrentUser';
import {useFetchProject} from 'shared/hooks/useProject';
import {useModalNotifications} from 'shared/hooks/useModalNotifications';

// App Routes with Sidebar
const AppSidebarRoutes = lazy(
	() =>
		import(
			/* webpackChunkName: "AppSidebarRoutes" */ 'shared/pages/AppSidebarRoutes'
		)
);

// Settings
const Settings = lazy(
	() => import(/* webpackChunkName: "Settings" */ 'settings/pages/Settings')
);

const WorkspaceLayer = () => {
	const location = useLocation();
	const path = matchPath<any>(location.pathname, {
		path: Routes.WORKSPACE_WITH_ID
	});
	const groupId = path?.params?.groupId ?? '0';
	const {userId} = useCurrentUser();
	const {data: project, loading} = useFetchProject();

	useEffect(() => {
		if (groupId !== '0' && project) {
			const faroSubscriptionIMap = project.get('faroSubscription');
			const serverLocation = project.get('serverLocation');
			const subscriptionName = faroSubscriptionIMap.get('name');
			const workspaceName = project.get('name');

			analytics?.track(
				'User accessed workspace',
				{
					groupId,
					serverLocation,
					subscriptionName,
					userId,
					workspaceName
				},
				{ip: '0'}
			);
		}
	}, [groupId, project]);

	useModalNotifications(groupId);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<Suspense fallback={<Loading />}>
				<Switch>
					<BundleRouter data={Settings} path={Routes.SETTINGS} />

					<BundleRouter
						data={AppSidebarRoutes}
						path={Routes.CHANNEL}
					/>

					<RouteNotFound />
				</Switch>
			</Suspense>

			<HelpWidget groupId={groupId} project={project} />
		</>
	);
};

export default WorkspaceLayer;

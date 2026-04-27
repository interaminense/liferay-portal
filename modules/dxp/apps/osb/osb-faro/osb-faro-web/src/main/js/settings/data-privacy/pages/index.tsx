import BundleElement from 'route-middleware/BundleRouter';
import Loading from 'shared/components/Loading';
import React, {lazy, Suspense} from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import {relativeRoute, Routes} from 'shared/util/router';
import {Route, Routes as RouterRoutes} from 'react-router-dom';

// Inside DataPrivacy, paths are relative to /workspace/:groupId/settings/data-privacy.
const dpRel = (absPath: string) =>
	relativeRoute(Routes.SETTINGS_DATA_PRIVACY, absPath);

const Overview = lazy(
	() => import(/* webpackChunkName: "DataPrivacyOverview" */ './Overview')
);

const RequestLog = lazy(
	() => import(/* webpackChunkName: "RequestLog" */ './RequestLog')
);

const SuppressedUsers = lazy(
	() => import(/* webpackChunkName: "SupressedUsers" */ './SuppressedUsers')
);

interface IDataPrivacyProps extends React.HTMLAttributes<HTMLDivElement> {
	groupId: string;
}

const DataPrivacy: React.FC<IDataPrivacyProps> = ({groupId}) => (
	<Suspense fallback={<Loading />}>
		<RouterRoutes>
			<Route element={<BundleElement data={Overview} />} path='' />

			<Route
				element={
					<BundleElement
						componentProps={{groupId}}
						data={SuppressedUsers}
						destructured={false}
					/>
				}
				path={dpRel(Routes.SETTINGS_DATA_PRIVACY_SUPPRESSED_USERS)}
			/>

			<Route
				element={
					<BundleElement
						componentProps={{groupId}}
						data={RequestLog}
						destructured={false}
					/>
				}
				path={dpRel(Routes.SETTINGS_DATA_PRIVACY_REQUEST_LOG)}
			/>

			<Route element={<RouteNotFound />} path='*' />
		</RouterRoutes>
	</Suspense>
);

export default DataPrivacy;

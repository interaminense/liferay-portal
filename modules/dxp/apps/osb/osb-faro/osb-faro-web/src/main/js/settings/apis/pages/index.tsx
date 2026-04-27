import BundleElement from 'route-middleware/BundleRouter';
import Loading from 'shared/components/Loading';
import React, {lazy, Suspense} from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import {relativeRoute, Routes} from 'shared/util/router';
import {Route, Routes as RouterRoutes} from 'react-router-dom';

// Inside Apis, paths are relative to /workspace/:groupId/settings/apis.
const apisRel = (absPath: string) =>
	relativeRoute(Routes.SETTINGS_APIS, absPath);

const AccessTokenList = lazy(
	() => import(/* webpackChunkName: "AccessTokenList" */ './AccessTokenList')
);

interface IApisProps extends React.HTMLAttributes<HTMLDivElement> {
	groupId: string;
}

const DataPrivacy: React.FC<IApisProps> = () => (
	<Suspense fallback={<Loading />}>
		<RouterRoutes>
			<Route
				element={<BundleElement data={AccessTokenList} />}
				path={apisRel(Routes.SETTINGS_APIS_TOKEN_LIST)}
			/>

			<Route element={<RouteNotFound />} path='*' />
		</RouterRoutes>
	</Suspense>
);

export default DataPrivacy;

import BundleRouter from 'route-middleware/BundleRouter';
import Loading from 'shared/components/Loading';
import Overview from './Overview';
import React, {lazy, Suspense} from 'react';
import RequestLog from './RequestLog';
import RouteNotFound from 'shared/components/RouteNotFound';
import SuppressedUsers from './SuppressedUsers';
import {Routes as Path} from 'shared/util/router';
import {Route, Routes} from 'react-router';

const DataPrivacy = () => (
	<Suspense fallback={<Loading />}>
		<Routes>
			<Route
				element={<BundleRouter data={Overview} path='*' />}
				path='*'
			/>

			<Route
				element={
					<BundleRouter
						data={SuppressedUsers}
						path='/suppressed-users'
					/>
				}
				path='/suppressed-users'
			/>

			<Route
				element={<BundleRouter data={RequestLog} path='/request-log' />}
				path='/request-log'
			/>
		</Routes>

		{/* <RouteNotFound /> */}
	</Suspense>
);

export default DataPrivacy;

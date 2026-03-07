import BundleRouter from 'route-middleware/BundleRouter';
import Loading from 'shared/components/Loading';
import React, {lazy, Suspense} from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import {Routes as Path} from 'shared/util/router';
import {Routes, Route} from 'react-router';
import Overview from './Overview';
import RequestLog from './RequestLog';
import SuppressedUsers from './SuppressedUsers';

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

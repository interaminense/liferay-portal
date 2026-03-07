import BundleRouter from 'route-middleware/BundleRouter';
import checkProjectState from 'shared/hoc/CheckProjectState';
import Loading from 'shared/components/Loading';
import React, {Fragment, lazy, Suspense} from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import {compose} from 'shared/hoc';
import {ENABLE_CSVFILE} from 'shared/util/constants';
import {Routes as Path} from 'shared/util/router';
import {Route, Routes, useParams} from 'react-router';
import {useStore} from 'react-redux';
import {withOnboarding} from 'shared/hoc';
import DataSourceList from './DataSourceList';
import DataSourceOnboarding from './data-source/Onboarding';
import DeleteDataSource from 'settings/components/DeleteDataSource';
import Edit from './data-source/Edit';
import ConfigureCSV from './data-source/ConfigureCSV';
import UploadCSV from './data-source/UploadCSV';
import View from './data-source/View';
import User from './user';
import UsageOverview from './UsageOverview';
import UsageOverviewSaaS from './UsageOverviewSaaS';
import Definitions from 'settings/definitions/pages';
import DataPrivacy from 'settings/data-privacy/pages';
import Workspace from './Workspace';
import ChannelView from 'settings/channels/pages/View';
import ChannelList from 'settings/channels/pages/ChannelList';
import RecommendationList from 'settings/recommendations/hocs/RecommendationList';
import RecomendationCreateItemSimilarity from 'settings/recommendations/pages/CreateItemSimilarity';
import RecommendationEdit from 'settings/recommendations/pages/Edit';
import RecommendationView from 'settings/recommendations/pages/View';
import AccessTokenList from 'settings/apis/pages/AccessTokenList';

export const Settings = () => {
	const {groupId} = useParams();
	const store = useStore();

	const project = store.getState().getIn(['projects', groupId, 'data']);
	const recommendationsEnabled = store
		.getState()
		.getIn(['projects', groupId, 'data', 'recommendationsEnabled'], false);

	const IS_PROJECT_SAAS = project?.faroSubscription
		?.get('name')
		?.includes('SaaS');

	return (
		<Suspense fallback={<Loading />}>
			<Routes>
				<Route
					path='data-source'
					element={
						<BundleRouter
							data={DataSourceList}
							path='/data-source'
						/>
					}
				/>

				<Route
					element={
						<BundleRouter
							data={DataSourceOnboarding}
							path={'/data-source/:id/onboarding'}
						/>
					}
					path={'/data-source/:id/onboarding'}
				/>

				<Route
					element={
						<BundleRouter
							data={DeleteDataSource}
							path={'/data-source/:id/delete'}
						/>
					}
					path={'/data-source/:id/delete'}
				/>

				<Route
					element={
						<BundleRouter
							data={Edit}
							path={'/data-source/:id/edit'}
						/>
					}
					path={'/data-source/:id/edit'}
				/>

				{ENABLE_CSVFILE && (
					<Route
						element={
							<BundleRouter
								data={ConfigureCSV}
								path={'/data-source/csv/:fileVersionId'}
							/>
						}
						path={'/data-source/csv/:fileVersionId'}
					/>
				)}

				{ENABLE_CSVFILE && (
					<Route
						element={
							<BundleRouter
								data={UploadCSV}
								path={'/data-source/csv'}
							/>
						}
						path={'/data-source/csv'}
					/>
				)}

				<Route
					element={
						<BundleRouter data={View} path={'/data-source/:id?'} />
					}
					path={'/data-source/:id?'}
				/>

				<Route
					element={<BundleRouter data={User} path='/users/*' />}
					path='/users/*'
				/>

				{!IS_PROJECT_SAAS && (
					<Route
						element={
							<BundleRouter
								data={UsageOverview}
								path={'/usage'}
							/>
						}
						path={'/usage'}
					/>
				)}

				{IS_PROJECT_SAAS && (
					<Route
						element={
							<BundleRouter
								data={UsageOverviewSaaS}
								path={'/usage'}
							/>
						}
						path={'/usage'}
					/>
				)}

				<Route
					element={
						<BundleRouter
							data={Definitions}
							path={'/definitions/*'}
						/>
					}
					path={'/definitions/*'}
				/>

				<Route
					element={
						<BundleRouter
							data={DataPrivacy}
							path={'/data-privacy/*'}
						/>
					}
					path={'/data-privacy/*'}
				/>

				<Route
					element={
						<BundleRouter data={Workspace} path={'/workspace'} />
					}
					path={'/workspace'}
				/>

				<Route
					element={
						<BundleRouter
							data={ChannelView}
							path={'/properties/:id'}
						/>
					}
					path={'/properties/:id'}
				/>

				<Route
					element={
						<BundleRouter data={ChannelList} path={'/properties'} />
					}
					path={'/properties'}
				/>

				<Route
					element={
						<BundleRouter
							data={AccessTokenList}
							path='/apis/tokens'
						/>
					}
					path='/apis/tokens'
				/>

				{recommendationsEnabled && (
					<Fragment key='RECOMMENDATIONS'>
						<Route
							element={
								<BundleRouter
									data={RecommendationList}
									destructured={false}
									path={'/recommendations'}
								/>
							}
							path={'/recommendations'}
						/>

						<Route
							element={
								<BundleRouter
									data={RecomendationCreateItemSimilarity}
									destructured={false}
									path={
										'/recommendations/create-item-similarity-model'
									}
								/>
							}
							path={
								'/recommendations/create-item-similarity-model'
							}
						/>

						<Route
							element={
								<BundleRouter
									data={RecommendationEdit}
									destructured={false}
									path={'/recommendations/:jobId/edit'}
								/>
							}
							path={'/recommendations/:jobId/edit'}
						/>

						<Route
							element={
								<BundleRouter
									data={RecommendationView}
									destructured={false}
									path={'/recommendations/:jobId'}
								/>
							}
							path={'/recommendations/:jobId'}
						/>
					</Fragment>
				)}

				{/* <RouteNotFound /> */}
			</Routes>
		</Suspense>
	);
};

export default compose(
	checkProjectState,
	withOnboarding
)(Settings) as React.ComponentType<any>;

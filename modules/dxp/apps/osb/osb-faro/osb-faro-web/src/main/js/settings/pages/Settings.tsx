import BundleElement from 'route-middleware/BundleRouter';
import checkProjectState from 'shared/hoc/CheckProjectState';
import Loading from 'shared/components/Loading';
import React, {Fragment, lazy, Suspense} from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import {compose} from 'shared/hoc';
import {ENABLE_CSVFILE} from 'shared/util/constants';
import {relativeRoute, Routes} from 'shared/util/router';
import {Route, Routes as RouterRoutes, useParams} from 'react-router-dom';

// All paths inside this <Routes> are relative to /workspace/:groupId/settings.
const settingsRel = (absPath: string) =>
	relativeRoute(Routes.SETTINGS, absPath);
import {useStore} from 'react-redux';
import {withOnboarding} from 'shared/hoc';

// APIS

const Apis = lazy(() => import(/* webpackChunkName: "Apis" */ '../apis/pages'));

// CSV data source

const ConfigureCSV = lazy(
	() =>
		import(
			/* webpackChunkName: "ConfigureCSV" */ './data-source/ConfigureCSV'
		)
);
const UploadCSV = lazy(
	() => import(/* webpackChunkName: "UploadCSV" */ './data-source/UploadCSV')
);

// Data Privacy

const DataPrivacy = lazy(
	() => import(/* webpackChunkName: "DataPrivacy" */ '../data-privacy/pages')
);

// Data source

const DataSource = lazy(
	() => import(/* webpackChunkName: "DataSource" */ './data-source/View')
);
const DataSourceEdit = lazy(
	() => import(/* webpackChunkName: "DataSourceEdit" */ './data-source/Edit')
);
const DataSourceOnboarding = lazy(
	() =>
		import(
			/* webpackChunkName: "DataSourceEdit" */ './data-source/Onboarding'
		)
);
const DataSourceList = lazy(
	() => import(/* webpackChunkName: "DataSourceList" */ './DataSourceList')
);
const DeleteDataSource = lazy(
	() =>
		import(
			/* webpackChunkName: "DeleteDataSource" */ './data-source/Delete'
		) as any
);

// Definitions

const Definitions = lazy(
	() => import(/* webpackChunkName: "Definitions" */ '../definitions/pages')
);

// Channels

const ChannelList = lazy(
	() =>
		import(
			/* webpackChunkName: "ChannelList" */ '../channels/pages/ChannelList'
		)
);

const ChannelView = lazy(
	() => import(/* webpackChunkName: "ChannelView" */ '../channels/pages/View')
);

// Recommendations

const RecommendationList = lazy(
	() =>
		import(
			/* webpackChunkName: "RecommendationList" */ '../recommendations/pages/Recommendations'
		)
);

const RecommendationCreateItemSimilarity = lazy(
	() =>
		import(
			/* webpackChunkName: "RecommendationCreateItemSimilarity" */ '../recommendations/pages/CreateItemSimilarity'
		)
);

const RecommendationEdit = lazy(
	() =>
		import(
			/* webpackChunkName: "RecommendationEdit" */ '../recommendations/pages/Edit'
		)
);

const RecommendationView = lazy(
	() =>
		import(
			/* webpackChunkName: "RecommendationView" */ '../recommendations/pages/View'
		)
);

// Other

const UsageOverview = lazy(
	() => import(/* webpackChunkName: "UsageOverview" */ './UsageOverview')
);

const UsageOverviewSaaS = lazy(
	() =>
		import(
			/* webpackChunkName: "UsageOverviewSaaS" */ './UsageOverviewSaaS'
		)
);

const Users = lazy(() => import(/* webpackChunkName: "Users" */ './user'));

const WorkspaceSettings = lazy(
	() => import(/* webpackChunkName: "WorkspaceSettings" */ './Workspace')
);

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
			<RouterRoutes>
				<Route
					element={<BundleElement data={DataSourceList} />}
					path={settingsRel(Routes.SETTINGS_DATA_SOURCE_LIST)}
				/>

				<Route
					element={<BundleElement data={DataSourceOnboarding} />}
					path={settingsRel(Routes.SETTINGS_DATA_SOURCE_ONBOARDING)}
				/>

				<Route
					element={<BundleElement data={DeleteDataSource} />}
					path={settingsRel(Routes.SETTINGS_DATA_SOURCE_DELETE)}
				/>

				<Route
					element={<BundleElement data={DataSourceEdit} />}
					path={settingsRel(Routes.SETTINGS_DATA_SOURCE_EDIT)}
				/>

				{ENABLE_CSVFILE && (
					<Route
						element={<BundleElement data={ConfigureCSV} />}
						path={settingsRel(Routes.SETTINGS_CSV_UPLOAD_CONFIGURE)}
					/>
				)}

				{ENABLE_CSVFILE && (
					<Route
						element={<BundleElement data={UploadCSV} />}
						path={settingsRel(Routes.SETTINGS_CSV_UPLOAD)}
					/>
				)}

				<Route
					element={<BundleElement data={DataSource} />}
					path={settingsRel(Routes.SETTINGS_DATA_SOURCE)}
				/>

				<Route
					element={<BundleElement data={Users} />}
					path={`${settingsRel(Routes.SETTINGS_USERS)}/*`}
				/>

				{!IS_PROJECT_SAAS && (
					<Route
						element={<BundleElement data={UsageOverview} />}
						path={settingsRel(Routes.SETTINGS_USAGE)}
					/>
				)}

				{IS_PROJECT_SAAS && (
					<Route
						element={<BundleElement data={UsageOverviewSaaS} />}
						path={settingsRel(Routes.SETTINGS_USAGE)}
					/>
				)}

				<Route
					element={<BundleElement data={Definitions} />}
					path={`${settingsRel(Routes.SETTINGS_DEFINITIONS)}/*`}
				/>

				<Route
					element={<BundleElement data={DataPrivacy} />}
					path={`${settingsRel(Routes.SETTINGS_DATA_PRIVACY)}/*`}
				/>

				<Route
					element={<BundleElement data={WorkspaceSettings} />}
					path={settingsRel(Routes.SETTINGS_WORKSPACE)}
				/>

				<Route
					element={<BundleElement data={ChannelView} />}
					path={settingsRel(Routes.SETTINGS_CHANNELS_VIEW)}
				/>

				<Route
					element={<BundleElement data={ChannelList} />}
					path={settingsRel(Routes.SETTINGS_CHANNELS)}
				/>

				<Route
					element={<BundleElement data={Apis} />}
					path={`${settingsRel(Routes.SETTINGS_APIS)}/*`}
				/>

				{recommendationsEnabled && (
					<Fragment key='RECOMMENDATIONS'>
						<Route
							element={
								<BundleElement
									data={RecommendationList}
									destructured={false}
								/>
							}
							path={settingsRel(Routes.SETTINGS_RECOMMENDATIONS)}
						/>

						<Route
							element={
								<BundleElement
									data={RecommendationCreateItemSimilarity}
									destructured={false}
								/>
							}
							path={settingsRel(
								Routes.SETTINGS_RECOMMENDATIONS_CREATE_ITEM_SIMILARITY_MODEL
							)}
						/>

						<Route
							element={
								<BundleElement
									data={RecommendationEdit}
									destructured={false}
								/>
							}
							path={settingsRel(
								Routes.SETTINGS_RECOMMENDATION_EDIT
							)}
						/>

						<Route
							element={
								<BundleElement
									data={RecommendationView}
									destructured={false}
								/>
							}
							path={settingsRel(
								Routes.SETTINGS_RECOMMENDATION_MODEL_VIEW
							)}
						/>
					</Fragment>
				)}

				<Route element={<RouteNotFound />} path='*' />
			</RouterRoutes>
		</Suspense>
	);
};

export default compose<any>(checkProjectState, withOnboarding)(Settings);

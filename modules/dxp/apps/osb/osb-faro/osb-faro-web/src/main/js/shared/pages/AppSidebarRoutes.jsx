import BundleElement from '../../route-middleware/BundleRouter';
import Loading from 'shared/components/Loading';
import React, {lazy, Suspense} from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import withRouter from 'shared/hoc/WithRouter';
import {ChannelContext} from 'shared/context/channel';
import {connect} from 'react-redux';
import {DEVELOPER_MODE} from 'shared/util/constants';
import {DownloadReportProvider} from 'shared/components/download-report/DownloadReportContext';
import {ENABLE_ASSET_OBJECT_ENTRY} from 'shared/util/constants';
import {relativeRoute, Routes} from 'shared/util/router';
import {Route, Routes as RouterRoutes} from 'react-router-dom';
import {
	withLDPEnabled,
	withOnboarding,
	withSidebar,
	withUnassignedSegments
} from 'shared/hoc';

// Inside AppSidebarRoutes, all <Route> paths are relative to the workspace
// (Routes.WORKSPACE_WITH_ID = `/workspace/:groupId`). v7 nested <Routes> only
// matches relative paths, so absolute paths from the Routes constants need to
// be stripped before being used here.
const wsRel = absPath => relativeRoute(Routes.WORKSPACE_WITH_ID, absPath);

const UIKit = lazy(() =>
	import(/* webpackChunkName: "UIKit" */ '../../ui-kit/pages/index')
);

/* No Properties Available */
const NoPropertiesAvailable = lazy(() =>
	import(
		/* webpackChunkName: "NoPropertiesAvailable" */ './NoPropertiesAvailable'
	)
);

/* Segments */
const SegmentsList = lazy(() =>
	import(/* webpackChunkName: "SegmentsList" */ '../../segment/pages/List')
);
const SegmentProfileRoutes = lazy(() =>
	import(
		/* webpackChunkName: "SegmentProfileRoutes" */ '../../segment/pages/ProfileRoutes'
	)
);
const SegmentEdit = lazy(() =>
	import(/* webpackChunkName: "SegmentEdit" */ '../../segment/pages/Edit')
);

/* Accounts */

const AccountsList = lazy(() =>
	import(
		/* webpackChunkName: "AccountsList" */ '../../contacts/pages/account/List'
	)
);
const AccountProfileRoutes = lazy(() =>
	import(
		/* webpackChunkName: "AccountProfileRoutes" */ '../../contacts/pages/account/ProfileRoutes'
	)
);

/* Event Analysis */

const EventAnalysisCreate = lazy(() =>
	import(
		/* webpackChunkName: "EventAnalysisCreate" */ '../../event-analysis/pages/Create'
	)
);

const EventAnalysisEdit = lazy(() =>
	import(
		/* webpackChunkName: "EventAnalysisEdit" */ '../../event-analysis/pages/Edit'
	)
);

const EventAnalysisList = lazy(() =>
	import(
		/* webpackChunkName: "EventAnalysisList" */ '../../event-analysis/pages/List'
	)
);

/* Individuals */

const IndividualProfileRoutes = lazy(() =>
	import(
		/* webpackChunkName: "IndividualProfileRoutes" */ '../../individual/profile/pages/ProfileRoutes'
	)
);

const IndividualProfileRoutesCDP = lazy(() =>
	import(
		/* webpackChunkName: "IndividualProfileRoutesCDP" */ '../../individual/profile/pages/ProfileRoutesCDP'
	)
);

const IndividualsDashboard = lazy(() =>
	import(
		/* webpackChunkName: "IndividualsDashboard" */ '../../individual/dashboard/pages'
	)
);

const IndividualsDashboardCDP = lazy(() =>
	import(
		/* webpackChunkName: "IndividualsDashboardCDP" */ '../../individual/dashboard/pages/IndividualsDashboardCDP'
	)
);

/* Lifecycle */
const LifecycleDashboard = lazy(() =>
	import(
		/* webpackChunkname: "LifecycleDashboard" */ '../../lifecycle/pages/BaseLifecycle'
	)
);

/* Sites */

const SitesDashboard = lazy(() =>
	import(/* webpackChunkName: "SitesDashboard" */ '../../sites/pages')
);

/* Experiments */

const ExperimentsList = lazy(() =>
	import(
		/* webpackChunkName: "ExperimentsList" */ '../../experiments/pages/ExperimentsListPage'
	)
);

const ExperimentOverview = lazy(() =>
	import(
		/* webpackChunkName: "ExperimentsList" */ '../../experiments/pages/ExperimentOverviewPage'
	)
);

const TouchpointRoutes = lazy(() =>
	import(
		/* webpackChunkName: "TouchpointRoutes" */ 'sites/touchpoints/pages/TouchpointRoutes'
	)
);

/* Assets */

const NewAssetsList = lazy(() =>
	import(/* webpackChunkName: "NewAssetsList" */ 'assets/pages/List')
);

const AssetsList = lazy(() =>
	import(/* webpackChunkName: "AssetsList" */ 'assets/pages')
);

const Blog = lazy(() =>
	import(/* webpackChunkName: "Blog" */ 'assets/blog/pages')
);

const CustomAssetsDashboard = lazy(() =>
	import(
		/* webpackChunkName: "CustomAssetsDashboard" */ 'assets/custom-asset/pages/Dashboard'
	)
);

const DocumentAndMedia = lazy(() =>
	import(
		/* webpackChunkName: "DocumentAndMedia" */ 'assets/document-and-media/pages'
	)
);

const Form = lazy(() =>
	import(/* webpackChunkName: "Form" */ 'assets/form/pages')
);

const WebContent = lazy(() =>
	import(/* webpackChunkName: "WebContent" */ 'assets/web-content/pages')
);

const ObjectEntry = lazy(() =>
	import(/* webpackChunkName: "ObjectEntry" */ 'assets/object-entry/pages')
);

/* Commmerce */

const CommerceDashboard = lazy(() =>
	import(/* webpackChunkName: "CommerceDashboard" */ 'commerce/pages')
);

const ROUTES = [
	{
		data: SegmentsList,
		path: Routes.CONTACTS_LIST_SEGMENT
	},
	{
		data: SegmentEdit,
		path: Routes.CONTACTS_SEGMENT_EDIT
	},
	{
		data: SegmentEdit,
		path: Routes.CONTACTS_SEGMENT_CREATE
	},
	{
		data: SegmentProfileRoutes,
		exact: false,
		path: Routes.CONTACTS_SEGMENT
	},
	{
		data: Blog,
		destructured: false,
		path: Routes.ASSETS_BLOGS_ROUTES
	},
	{
		data: CustomAssetsDashboard,
		destructured: false,
		path: Routes.ASSETS_CUSTOM_DASHBOARD
	},
	{
		data: DocumentAndMedia,
		destructured: false,
		exact: false,
		path: Routes.ASSETS_DOCUMENTS_AND_MEDIA_ROUTES
	},
	{
		data: Form,
		destructured: false,
		exact: false,
		path: Routes.ASSETS_FORMS_ROUTES
	},
	{
		data: WebContent,
		destructured: false,
		exact: false,
		path: Routes.ASSETS_WEB_CONTENT_ROUTES
	},
	{
		data: ObjectEntry,
		destructured: false,
		exact: false,
		path: Routes.ASSETS_OBJECT_ENTRY_ROUTES
	},
	{
		data: TouchpointRoutes,
		destructured: false,
		exact: false,
		path: Routes.SITES_TOUCHPOINTS_ROUTES
	},
	{
		data: EventAnalysisList,
		destructured: false,
		exact: true,
		path: Routes.EVENT_ANALYSIS
	},
	{
		data: EventAnalysisCreate,
		destructured: false,
		exact: true,
		path: Routes.EVENT_ANALYSIS_CREATE
	},
	{
		data: EventAnalysisEdit,
		destructured: false,
		exact: true,
		path: Routes.EVENT_ANALYSIS_EDIT
	},
	{
		data: ExperimentsList,
		destructured: false,
		path: Routes.TESTS
	},
	{
		data: ExperimentOverview,
		destructured: false,
		path: Routes.TESTS_OVERVIEW
	},
	{
		data: ENABLE_ASSET_OBJECT_ENTRY ? NewAssetsList : AssetsList,
		destructured: false,
		exact: false,
		path: Routes.ASSETS
	},
	{
		data: SitesDashboard,
		destructured: false,
		exact: false,
		path: Routes.SITES
	},
	{
		data: SitesDashboard,
		destructured: false,
		path: Routes.CHANNEL
	},
	DEVELOPER_MODE && {
		data: CommerceDashboard,
		destructured: false,
		path: Routes.COMMERCE
	}
].filter(Boolean);

@withRouter
@withSidebar
@withOnboarding
@withUnassignedSegments
@withLDPEnabled
@connect((store, {groupId}) => ({
	project: store.getIn(['projects', groupId, 'data'])
}))
export default class AppSidebarRoutes extends React.PureComponent {
	static contextType = ChannelContext;

	render() {
		const {LDPEnabled, currentUser, groupId} = this.props;
		const {selectedChannel} = this.context;

		return (
			<DownloadReportProvider>
				<Suspense fallback={<Loading />}>
					<RouterRoutes>
						{!selectedChannel && (
							<Route
								element={
									<BundleElement
										componentProps={{currentUser, groupId}}
										data={NoPropertiesAvailable}
									/>
								}
								path=''
							/>
						)}

						{LDPEnabled ? (
							<Route
								element={
									<BundleElement
										data={IndividualProfileRoutesCDP}
									/>
								}
								path={`${wsRel(Routes.CONTACTS_INDIVIDUAL)}/*`}
							/>
						) : (
							<Route
								element={
									<BundleElement
										data={IndividualProfileRoutes}
									/>
								}
								path={`${wsRel(Routes.CONTACTS_INDIVIDUAL)}/*`}
							/>
						)}

						{LDPEnabled ? (
							<Route
								element={
									<BundleElement
										data={IndividualsDashboardCDP}
										destructured={false}
									/>
								}
								path={`${wsRel(Routes.CONTACTS_INDIVIDUALS)}/*`}
							/>
						) : (
							<Route
								element={
									<BundleElement
										data={IndividualsDashboard}
										destructured={false}
									/>
								}
								path={`${wsRel(Routes.CONTACTS_INDIVIDUALS)}/*`}
							/>
						)}

						{LDPEnabled && (
							<Route
								element={<BundleElement data={AccountsList} />}
								path={wsRel(Routes.CONTACTS_LIST_ACCOUNT)}
							/>
						)}

						{LDPEnabled && (
							<Route
								element={
									<BundleElement
										data={AccountProfileRoutes}
									/>
								}
								path={`${wsRel(Routes.CONTACTS_ACCOUNT)}/*`}
							/>
						)}

						{LDPEnabled && (
							<Route
								element={
									<BundleElement
										data={LifecycleDashboard}
										destructured={false}
									/>
								}
								path={wsRel(Routes.LIFECYCLE)}
							/>
						)}

						{ROUTES.map(({data, path, ...otherProps}) => {
							// `exact` was a v5 prop on Route; v7 paths are exact
							// by default. We append /* to non-exact routes so
							// descendant routers can take over the rest of the
							// pathname.
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							const {exact = true, ...rest} = otherProps;
							const relPath = wsRel(path);

							return (
								<Route
									element={
										<BundleElement {...rest} data={data} />
									}
									key={path}
									path={exact ? relPath : `${relPath}/*`}
								/>
							);
						})}

						{DEVELOPER_MODE && (
							<Route
								element={<BundleElement data={UIKit} />}
								path={wsRel(Routes.UI_KIT)}
							/>
						)}

						<Route element={<RouteNotFound />} path='*' />
					</RouterRoutes>
				</Suspense>
			</DownloadReportProvider>
		);
	}
}

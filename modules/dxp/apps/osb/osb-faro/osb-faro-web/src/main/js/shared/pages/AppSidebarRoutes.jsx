import BundleRouter from '../../route-middleware/BundleRouter';
import Loading from 'shared/components/Loading';
import React, {lazy, Suspense} from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import {ChannelContext} from 'shared/context/channel';
import {connect} from 'react-redux';
import {
	DEVELOPER_MODE,
	ENABLE_ACCOUNTS,
	ENABLE_CDP
} from 'shared/util/constants';
import {DownloadReportProvider} from 'shared/components/download-report/DownloadReportContext';
import {Routes as Path} from 'shared/util/router';
import {withOnboarding, withUnassignedSegments} from 'shared/hoc';
import {withRouter, withSidebar} from 'shared/hoc';
import {Route, Routes, useParams} from 'react-router';
import {fetchProject} from 'shared/actions/projects';
import Sidebar from 'shared/components/sidebar';
import NoPropertiesAvailable from './NoPropertiesAvailable';

const UIKit = lazy(() =>
	import(/* webpackChunkName: "UIKit" */ '../../ui-kit/pages/index')
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

/* Commmerce */

const CommerceDashboard = lazy(() =>
	import(/* webpackChunkName: "CommerceDashboard" */ 'commerce/pages')
);

const ROUTES = [
	ENABLE_ACCOUNTS && {
		data: AccountsList,
		path: Path.CONTACTS_LIST_ACCOUNT
	},
	{
		data: AccountProfileRoutes,
		path: Path.CONTACTS_ACCOUNT
	},
	{
		data: IndividualProfileRoutes,
		path: Path.CONTACTS_INDIVIDUAL
	},
	{
		data: ENABLE_CDP ? IndividualsDashboardCDP : IndividualsDashboard,
		destructured: false,
		path: Path.CONTACTS_INDIVIDUALS
	},
	{
		data: SegmentsList,
		path: Path.CONTACTS_LIST_SEGMENT
	},
	{
		data: SegmentEdit,
		path: Path.CONTACTS_SEGMENT_EDIT
	},
	{
		data: SegmentEdit,
		path: Path.CONTACTS_SEGMENT_CREATE
	},
	{
		data: SegmentProfileRoutes,
		path: Path.CONTACTS_SEGMENT
	},
	{
		data: Blog,
		destructured: false,
		path: Path.ASSETS_BLOGS_ROUTES
	},
	{
		data: CustomAssetsDashboard,
		destructured: false,
		path: Path.ASSETS_CUSTOM_DASHBOARD
	},
	{
		data: DocumentAndMedia,
		destructured: false,
		path: Path.ASSETS_DOCUMENTS_AND_MEDIA_ROUTES
	},
	{
		data: Form,
		destructured: false,
		path: Path.ASSETS_FORMS_ROUTES
	},
	{
		data: WebContent,
		destructured: false,
		path: Path.ASSETS_WEB_CONTENT_ROUTES
	},
	{
		data: TouchpointRoutes,
		destructured: false,
		path: Path.SITES_TOUCHPOINTS_ROUTES
	},
	{
		data: EventAnalysisList,
		destructured: false,
		path: Path.EVENT_ANALYSIS
	},
	{
		data: EventAnalysisCreate,
		destructured: false,
		path: Path.EVENT_ANALYSIS_CREATE
	},
	{
		data: EventAnalysisEdit,
		destructured: false,
		path: Path.EVENT_ANALYSIS_EDIT
	},
	{
		data: ExperimentsList,
		destructured: false,
		path: Path.TESTS
	},
	{
		data: ExperimentOverview,
		destructured: false,
		path: Path.TESTS_OVERVIEW
	},
	{
		data: AssetsList,
		destructured: false,
		path: Path.ASSETS
	},
	{
		data: SitesDashboard,
		destructured: false,
		path: Path.SITES
	},
	{
		data: SitesDashboard,
		destructured: false,
		path: Path.CHANNEL
	},
	DEVELOPER_MODE && {
		data: CommerceDashboard,
		destructured: false,
		path: Path.COMMERCE
	}
].filter(Boolean);

@withRouter
@withSidebar
@withOnboarding
@withUnassignedSegments
@connect((store, {groupId}) => ({
	project: store.getIn(['projects', groupId, 'data'])
}))
class AppSidebarRoutes extends React.PureComponent {
	static contextType = ChannelContext;

	render() {
		const {selectedChannel} = this.context;

		return (
			// <DownloadReportProvider>
			<Suspense fallback={<Loading />}>
				<Routes>
					{!selectedChannel && (
						<Route
							path='*'
							element={
								<BundleRouter
									data={NoPropertiesAvailable}
									path='*'
								/>
							}
						/>
					)}

					{ROUTES.map(({data, path, ...otherProps}) => (
						<Route
							key={path}
							path={path}
							element={
								<BundleRouter
									{...otherProps}
									data={data}
									path={path}
								/>
							}
						/>
					))}

					{DEVELOPER_MODE && (
						<Route
							element={
								<BundleRouter data={UIKit} path={Path.UI_KIT} />
							}
							path={Path.UIKit}
						/>
					)}

					{/* <RouteNotFound /> */}
				</Routes>
			</Suspense>
			// </DownloadReportProvider>
		);
	}
}

// const AppSidebarRoutes = () => {
// 	const {groupId} = useParams();

// 	return (
// 		<>
// 			<Sidebar />

// 			<Routes>
// 				<Route
// 					element={
// 						<BundleRouter data={NoPropertiesAvailable} path='*' />
// 					}
// 					path='*'
// 				/>
// 			</Routes>
// 		</>
// 	);
// };

export default AppSidebarRoutes;

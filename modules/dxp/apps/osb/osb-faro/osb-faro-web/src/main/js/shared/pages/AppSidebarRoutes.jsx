import AccountProfileRoutes from '../../contacts/pages/account/ProfileRoutes';
import AccountsList from '../../contacts/pages/account/List';
import AssetsList from 'assets/pages';
import Blog from 'assets/blog/pages';
import BlogsList from 'assets/pages/BlogsList';
import BundleRouter from '../../route-middleware/BundleRouter';
import CommerceDashboard from 'commerce/pages';
import CustomAssetsDashboard from 'assets/custom-asset/pages/Dashboard';
import DocumentAndMedia from 'assets/document-and-media/pages';
import DocumentsAndMediaList from 'assets/pages/DocumentsAndMediaList';
import EventAnalysisCreate from '../../event-analysis/pages/Create';
import EventAnalysisEdit from '../../event-analysis/pages/Edit';
import EventAnalysisList from '../../event-analysis/pages/List';
import ExperimentOverview from '../../experiments/pages/ExperimentOverviewPage';
import ExperimentsList from '../../experiments/pages/ExperimentsListPage';
import Form from 'assets/form/pages';

import FormsList from 'assets/pages/FormsList';
import IndividualProfileRoutes from '../../individual/profile/pages/ProfileRoutes';
import IndividualsDashboard from '../../individual/dashboard/pages';
import IndividualsDashboardCDP from '../../individual/dashboard/pages/IndividualsDashboardCDP';
import InterestDetails from 'sites/pages/InterestDetails';
import Interests from 'sites/pages/Interests';
import Loading from 'shared/components/Loading';
import NoPropertiesAvailable from './NoPropertiesAvailable';
import Overview from 'sites/pages/Overview';
import React, {Suspense, useContext} from 'react';
import SearchTermsPage from 'sites/pages/SearchTermsPage';
import SegmentEdit from '../../segment/pages/Edit';
import SegmentProfileRoutes from '../../segment/pages/ProfileRoutes';
import SegmentsList from '../../segment/pages/List';
import SitesDashboard from '../../sites/pages';
import TouchpointRoutes from 'sites/touchpoints/pages/TouchpointRoutes';
import Touchpoints from 'sites/pages/Touchpoints';
import UIKit from '../../ui-kit/pages/index';
import WebContent from 'assets/web-content/pages';
import WebContentList from 'assets/pages/WebContentList';
import {ChannelContext} from 'shared/context/channel';

import {compose} from 'redux';
import {connect} from 'react-redux';
import {
	DEVELOPER_MODE,
	ENABLE_ACCOUNTS,
	ENABLE_CDP
} from 'shared/util/constants';
import {DownloadReportProvider} from 'shared/components/download-report/DownloadReportContext';

import {Route, Routes} from 'react-router';
import {withOnboarding, withUnassignedSegments} from 'shared/hoc';
import {withRouter, withSidebar} from 'shared/hoc';

const AppSidebarRoutes = () => {
	const {selectedChannel} = useContext(ChannelContext);

	return (
		<DownloadReportProvider>
			<Suspense fallback={<Loading />}>
				<Routes>
					{!selectedChannel && (
						<Route
							element={
								<BundleRouter
									data={NoPropertiesAvailable}
									path='*'
								/>
							}
							path='*'
						/>
					)}

					{selectedChannel && (
						<React.Fragment key='MAIN_ROUTES'>
							{ENABLE_ACCOUNTS && (
								<Route
									element={
										<BundleRouter
											data={AccountsList}
											path='/:channelId/contacts/:type(accounts)'
										/>
									}
									path='/:channelId/contacts/:type(accounts)'
								/>
							)}

							<Route
								element={
									<BundleRouter
										data={AccountProfileRoutes}
										path='/:channelId/contacts/accounts/:id'
									/>
								}
								path='/:channelId/contacts/accounts/:id'
							/>

							<Route
								element={
									<BundleRouter
										data={IndividualProfileRoutes}
										path='/:channelId/contacts/individual/:id'
									/>
								}
								path='/:channelId/contacts/individual/:id'
							/>

							<Route
								element={
									<BundleRouter
										data={
											ENABLE_CDP
												? IndividualsDashboardCDP
												: IndividualsDashboard
										}
										destructured={false}
										path='/:channelId/contacts/individuals'
									/>
								}
								path='/:channelId/contacts/individuals'
							/>

							<Route
								element={
									<BundleRouter
										data={SegmentsList}
										path='/:channelId/contacts/segments'
									/>
								}
								path='/:channelId/contacts/segments'
							/>

							<Route
								element={
									<BundleRouter
										data={SegmentEdit}
										path='/:channelId/contacts/segments/:id/edit'
									/>
								}
								path='/:channelId/contacts/segments/:id/edit'
							/>

							<Route
								element={
									<BundleRouter
										data={SegmentEdit}
										path='/:channelId/contacts/segments/create'
									/>
								}
								path='/:channelId/contacts/segments/create'
							/>

							<Route
								element={
									<BundleRouter
										data={SegmentProfileRoutes}
										path='/:channelId/contacts/segments/:id'
									/>
								}
								path='/:channelId/contacts/segments/:id'
							/>

							<Route
								element={
									<BundleRouter
										data={Blog}
										destructured={false}
										path='/:channelId/assets/blogs/:assetId/:tabId(page|known-individuals)/:touchpoint/:title?'
									/>
								}
								path='/:channelId/assets/blogs/:assetId/:tabId(page|known-individuals)/:touchpoint/:title?'
							/>

							<Route
								element={
									<BundleRouter
										data={CustomAssetsDashboard}
										destructured={false}
										path='/:channelId/assets/custom/:id/page/:touchpoint/:title?'
									/>
								}
								path='/:channelId/assets/custom/:id/page/:touchpoint/:title?'
							/>

							<Route
								element={
									<BundleRouter
										data={DocumentAndMedia}
										destructured={false}
										path='/:channelId/assets/documents-and-media/:assetId/:tabId(page|known-individuals)/:touchpoint/:title'
									/>
								}
								path='/:channelId/assets/documents-and-media/:assetId/:tabId(page|known-individuals)/:touchpoint/:title'
							/>

							<Route
								element={
									<BundleRouter
										data={Form}
										destructured={false}
										path='/:channelId/assets/forms/:assetId/:tabId(page|known-individuals)/:touchpoint/:title?'
									/>
								}
								path='/:channelId/assets/forms/:assetId/:tabId(page|known-individuals)/:touchpoint/:title?'
							/>

							<Route
								element={
									<BundleRouter
										data={WebContent}
										destructured={false}
										path='/:channelId/assets/web-content/:assetId/:tabId(page|known-individuals)/:touchpoint/:title?'
									/>
								}
								path='/:channelId/assets/web-content/:assetId/:tabId(page|known-individuals)/:touchpoint/:title?'
							/>

							<Route
								element={
									<BundleRouter
										data={TouchpointRoutes}
										destructured={false}
										path='/:channelId/sites/pages/:typeId/:touchpoint/:title?'
									/>
								}
								path='/:channelId/sites/pages/:typeId/:touchpoint/:title?'
							/>

							<Route
								element={
									<BundleRouter
										data={EventAnalysisList}
										destructured={false}
										path='/:channelId/event-analysis'
									/>
								}
								path='/:channelId/event-analysis'
							/>

							<Route
								element={
									<BundleRouter
										data={EventAnalysisCreate}
										destructured={false}
										path='/:channelId/event-analysis/create'
									/>
								}
								path='/:channelId/event-analysis/create'
							/>

							<Route
								element={
									<BundleRouter
										data={EventAnalysisEdit}
										destructured={false}
										path='/:channelId/event-analysis/:id'
									/>
								}
								path='/:channelId/event-analysis/:id'
							/>

							<Route
								element={
									<BundleRouter
										data={ExperimentsList}
										destructured={false}
										path='/:channelId/tests'
									/>
								}
								path='/:channelId/tests'
							/>

							<Route
								element={
									<BundleRouter
										data={ExperimentOverview}
										destructured={false}
										path='/:channelId/tests/overview/:id'
									/>
								}
								path='/:channelId/tests/overview/:id'
							/>

							<Route element={<AssetsList />}>
								<Route
									element={
										<BundleRouter
											data={BlogsList}
											destructured={false}
											path='/:channelId/assets'
										/>
									}
									path='/:channelId/assets'
								/>

								<Route
									element={
										<BundleRouter
											data={BlogsList}
											destructured={false}
											path='/:channelId/assets/blogs'
										/>
									}
									path='/:channelId/assets/blogs'
								/>

								<Route
									element={
										<BundleRouter
											data={DocumentsAndMediaList}
											destructured={false}
											path='/:channelId/assets/documents-and-media'
										/>
									}
									path='/:channelId/assets/documents-and-media'
								/>

								<Route
									element={
										<BundleRouter
											data={FormsList}
											destructured={false}
											path='/:channelId/assets/forms'
										/>
									}
									path='/:channelId/assets/forms'
								/>

								<Route
									element={
										<BundleRouter
											data={WebContentList}
											destructured={false}
											path='/:channelId/assets/web-content'
										/>
									}
									path='/:channelId/assets/web-content'
								/>
							</Route>

							<Route element={<SitesDashboard />}>
								<Route
									element={
										<BundleRouter
											data={Overview}
											destructured={false}
											path='/:channelId/sites'
										/>
									}
									index
									path='/:channelId/sites'
								/>

								<Route
									element={
										<BundleRouter
											data={Interests}
											destructured={false}
											path='/:channelId/sites/interests'
										/>
									}
									path='/:channelId/sites/interests'
								/>

								<Route
									element={
										<BundleRouter
											data={InterestDetails}
											destructured={false}
											path='/:channelId/sites/interests/:interestId'
										/>
									}
									path='/:channelId/sites/interests/:interestId'
								/>

								<Route
									element={
										<BundleRouter
											data={Touchpoints}
											destructured={false}
											path='/:channelId/sites/pages'
										/>
									}
									path='/:channelId/sites/pages'
								/>

								<Route
									element={
										<BundleRouter
											data={SearchTermsPage}
											destructured={false}
											path='/:channelId/sites/search-terms'
										/>
									}
									path='/:channelId/sites/search-terms'
								/>
							</Route>

							{DEVELOPER_MODE && (
								<Route
									element={
										<BundleRouter
											data={CommerceDashboard}
											destructured={false}
											path='/:channelId/commerce'
										/>
									}
									path='/:channelId/commerce'
								/>
							)}
						</React.Fragment>
					)}

					{DEVELOPER_MODE && (
						<Route
							element={
								<BundleRouter
									data={UIKit}
									path='/:channelId/ui-kit/:name?'
								/>
							}
							path='/:channelId/ui-kit/:name?'
						/>
					)}

					{/* <RouteNotFound /> */}
				</Routes>
			</Suspense>
		</DownloadReportProvider>
	);
};

export default compose(
	withRouter,
	withSidebar,
	withOnboarding,
	withUnassignedSegments,
	connect((store, {groupId}) => ({
		project: store.getIn(['projects', groupId, 'data'])
	}))
)(AppSidebarRoutes);

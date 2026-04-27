import * as breadcrumbs from 'shared/util/breadcrumbs';
import BasePage from 'shared/components/base-page';
import BundleElement from 'route-middleware/BundleRouter';
import getCN from 'classnames';
import Loading from 'shared/components/Loading';
import React, {lazy, Suspense} from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import withRouter from 'shared/hoc/WithRouter';
import {Account} from 'shared/util/records';
import {ChannelContext} from 'shared/context/channel';
import {compose, withAccount} from 'shared/hoc';
import {getMatchedRoute, relativeRoute, Routes} from 'shared/util/router';

// Inside AccountProfileRoutes, paths are relative to Routes.CONTACTS_ACCOUNT.
const accountRel = absPath => relativeRoute(Routes.CONTACTS_ACCOUNT, absPath);
import {PropTypes} from 'prop-types';
import {Route, Routes as RouterRoutes} from 'react-router-dom';

const Activities = lazy(() =>
	import(/* webpackChunkName: "AccountActivities" */ './hoc/Activities')
);
const AssociatedSegments = lazy(() =>
	import(/* webpackChunkName: "AssociatedSegments" */ './AssociatedSegments')
);
const Details = lazy(() =>
	import(/* webpackChunkName: "AccountDetails" */ './Details')
);
const InterestDetails = lazy(() =>
	import(/* webpackChunkName: "AccountInterestDetails" */ './InterestDetails')
);
const Interests = lazy(() =>
	import(/* webpackChunkName: "AccountInterests" */ './Interests')
);
const KnownIndividuals = lazy(() =>
	import(
		/* webpackChunkName: "AccountKnownIndividuals" */ './KnownIndividuals'
	)
);
const Overview = lazy(() =>
	import(/* webpackChunkName: "AccountOverview" */ './Overview')
);

const NAV_ITEMS = [
	{
		exact: true,
		label: Liferay.Language.get('overview'),
		route: Routes.CONTACTS_ACCOUNT
	},
	{
		exact: false,
		label: Liferay.Language.get('activities'),
		route: Routes.CONTACTS_ACCOUNT_ACTIVITIES
	},
	{
		exact: false,
		label: Liferay.Language.get('interests'),
		route: Routes.CONTACTS_ACCOUNT_INTERESTS
	},
	{
		exact: true,
		label: Liferay.Language.get('segments'),
		route: Routes.CONTACTS_ACCOUNT_SEGMENTS
	},
	{
		exact: true,

		label: Liferay.Language.get('individuals'),
		route: Routes.CONTACTS_ACCOUNT_INDIVIDUALS
	},
	{
		exact: true,
		label: Liferay.Language.get('details'),
		route: Routes.CONTACTS_ACCOUNT_DETAILS
	}
];

export class AccountProfileRoutes extends React.Component {
	static contextType = ChannelContext;

	static propTypes = {
		account: PropTypes.instanceOf(Account).isRequired,
		channelId: PropTypes.string,
		groupId: PropTypes.string.isRequired,
		id: PropTypes.string.isRequired
	};

	getClassNameForRoute() {
		const {className} = this.props;

		switch (getMatchedRoute(NAV_ITEMS)) {
			case Routes.CONTACTS_ACCOUNT:
				return getCN(
					'account-overview-root',
					'overview-root',
					className
				);
			case Routes.CONTACTS_ACCOUNT_ACTIVITIES:
				return getCN('account-activities-root', className);
			case Routes.CONTACTS_ACCOUNT_DETAILS:
				return getCN('account-details-root', className);
			case Routes.CONTACTS_ACCOUNT_INDIVIDUALS:
				return getCN('account-known-individuals-root', className);
			case Routes.CONTACTS_ACCOUNT_SEGMENTS:
			case Routes.CONTACTS_ACCOUNT_INTEREST_DETAILS:
			case Routes.CONTACTS_ACCOUNT_INTERESTS:
			default:
				return className;
		}
	}

	render() {
		const {account, channelId, groupId, id} = this.props;
		const {selectedChannel} = this.context;

		const componentProps = {account};

		const accountName = account.name || Liferay.Language.get('unknown');

		return (
			<BasePage
				className={this.getClassNameForRoute()}
				documentTitle={`${accountName} - ${Liferay.Language.get(
					'account'
				)}`}
			>
				<BasePage.Header
					breadcrumbs={[
						breadcrumbs.getHome({
							channelId,
							groupId,
							label: selectedChannel && selectedChannel.name
						}),
						breadcrumbs.getAccounts({channelId, groupId}),
						breadcrumbs.getEntityName({label: accountName})
					]}
					groupId={groupId}
				>
					<BasePage.Header.TitleSection title={accountName} />

					<BasePage.Header.NavBar
						items={NAV_ITEMS}
						routeParams={{channelId, groupId, id}}
					/>
				</BasePage.Header>

				<BasePage.Body>
					<Suspense fallback={<Loading />}>
						<RouterRoutes>
							<Route
								element={
									<BundleElement
										componentProps={componentProps}
										data={Activities}
									/>
								}
								path={accountRel(
									Routes.CONTACTS_ACCOUNT_ACTIVITIES
								)}
							/>

							<Route
								element={
									<BundleElement
										componentProps={componentProps}
										data={AssociatedSegments}
									/>
								}
								path={accountRel(
									Routes.CONTACTS_ACCOUNT_SEGMENTS
								)}
							/>

							<Route
								element={
									<BundleElement
										componentProps={componentProps}
										data={Details}
									/>
								}
								path={accountRel(
									Routes.CONTACTS_ACCOUNT_DETAILS
								)}
							/>

							<Route
								element={
									<BundleElement
										componentProps={componentProps}
										data={InterestDetails}
									/>
								}
								path={accountRel(
									Routes.CONTACTS_ACCOUNT_INTEREST_DETAILS
								)}
							/>

							<Route
								element={
									<BundleElement
										componentProps={componentProps}
										data={Interests}
										destructured={false}
									/>
								}
								path={accountRel(
									Routes.CONTACTS_ACCOUNT_INTERESTS
								)}
							/>

							<Route
								element={
									<BundleElement
										componentProps={componentProps}
										data={KnownIndividuals}
									/>
								}
								path={accountRel(
									Routes.CONTACTS_ACCOUNT_INDIVIDUALS
								)}
							/>

							<Route
								element={
									<BundleElement
										componentProps={componentProps}
										data={Overview}
									/>
								}
								path=''
							/>

							<Route element={<RouteNotFound />} path='*' />
						</RouterRoutes>
					</Suspense>
				</BasePage.Body>
			</BasePage>
		);
	}
}

export default compose(withRouter, withAccount)(AccountProfileRoutes);

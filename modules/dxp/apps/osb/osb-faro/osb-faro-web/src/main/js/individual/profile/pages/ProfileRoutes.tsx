import * as breadcrumbs from 'shared/util/breadcrumbs';
import BasePage from 'shared/components/base-page';
import BundleRouter from 'route-middleware/BundleRouter';
import DownloadCSVReport from 'shared/components/download-report/DownloadCSVReport';
import getCN from 'classnames';
import Loading from 'shared/components/Loading';
import React, {lazy, Suspense, useContext} from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import {ChannelContext} from 'shared/context/channel';
import {CSVType} from 'shared/components/download-report/utils';
import {getMatchedRoute, Routes} from 'shared/util/router';
import {useDataSource} from 'shared/hooks/useDataSource';
import {withIndividual} from 'shared/hoc';

const AssociatedSegments = lazy(
	() =>
		import(
			/* webpackChunkName: "IndividualAssociatedSegments" */ './AssociatedSegments'
		)
);
const Details = lazy(
	() => import(/* webpackChunkName: "IndividualDetails" */ './Details')
);
const InterestDetails = lazy(
	() =>
		import(
			/* webpackChunkName: "IndividualInterestDetails" */ './InterestDetails'
		)
);
const Interests = lazy(
	() => import(/* webpackChunkName: "IndividualInterests" */ './Interests')
);
const Overview = lazy(
	() => import(/* webpackChunkName: "IndividualOverview" */ './Overview')
);

const NAV_ITEMS = [
	{
		label: Liferay.Language.get('overview'),
		route: Routes.CONTACTS_INDIVIDUAL
	},
	{
		label: Liferay.Language.get('interests'),
		route: Routes.CONTACTS_INDIVIDUAL_INTERESTS
	},
	{
		label: Liferay.Language.get('segments'),
		route: Routes.CONTACTS_INDIVIDUAL_SEGMENTS
	},
	{
		label: Liferay.Language.get('details'),
		route: Routes.CONTACTS_INDIVIDUAL_DETAILS
	}
];

export const IndividualProfileRoutes = ({
	channelId,
	className,
	groupId,
	id,
	individual
}) => {
	const dataSourceStates = useDataSource();

	const {selectedChannel} = useContext(ChannelContext);

	const matchedRoute = getMatchedRoute(NAV_ITEMS);

	const componentProps = {individual};

	const entityName = individual.name || Liferay.Language.get('unknown');

	return (
		<BasePage
			className={
				matchedRoute === Routes.CONTACTS_INDIVIDUAL
					? getCN('overview-root', className)
					: className
			}
			documentTitle={`${entityName} - ${Liferay.Language.get(
				'individuals'
			)}`}
		>
			<BasePage.Header
				breadcrumbs={[
					breadcrumbs.getHome({
						channelId,
						groupId,
						label: selectedChannel && selectedChannel.name
					}),
					breadcrumbs.getKnownIndividuals({channelId, groupId}),
					breadcrumbs.getEntityName({label: entityName})
				]}
				groupId={groupId}
			>
				<BasePage.Header.TitleSection title={entityName} />

				<BasePage.Header.NavBar
					items={NAV_ITEMS}
					routeParams={{channelId, groupId, id}}
				/>
			</BasePage.Header>

			{getMatchedRoute(NAV_ITEMS) === Routes.CONTACTS_INDIVIDUAL && (
				<BasePage.SubHeader>
					<div className='d-flex justify-content-end w-100'>
						<DownloadCSVReport
							disabled={dataSourceStates.empty}
							individualId={individual.id}
							type={CSVType.Event}
							typeLang={Liferay.Language.get('events')}
						/>
					</div>
				</BasePage.SubHeader>
			)}

			<BasePage.Body>
				<Suspense fallback={<Loading />}>
					<BundleRouter
						componentProps={componentProps}
						data={AssociatedSegments}
						path={Routes.CONTACTS_INDIVIDUAL_SEGMENTS}
					/>

					<BundleRouter
						componentProps={componentProps}
						data={Details}
						path={Routes.CONTACTS_INDIVIDUAL_DETAILS}
					/>

					<BundleRouter
						componentProps={componentProps}
						data={InterestDetails}
						path={Routes.CONTACTS_INDIVIDUAL_INTEREST_DETAILS}
					/>

					<BundleRouter
						componentProps={componentProps}
						data={Interests}
						path={Routes.CONTACTS_INDIVIDUAL_INTERESTS}
					/>

					<BundleRouter
						componentProps={componentProps}
						data={Overview}
						path={Routes.CONTACTS_INDIVIDUAL}
					/>

					<RouteNotFound />
				</Suspense>
			</BasePage.Body>
		</BasePage>
	);
};

export default withIndividual(IndividualProfileRoutes);

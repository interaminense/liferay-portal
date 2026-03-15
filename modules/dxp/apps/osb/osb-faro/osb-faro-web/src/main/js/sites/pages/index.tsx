import * as breadcrumbs from 'shared/util/breadcrumbs';
import BasePage from 'shared/components/base-page';
import ClayLink from '@clayui/link';
import DownloadCSVReport from 'shared/components/download-report/DownloadCSVReport';
import DownloadPDFReport from 'shared/components/download-report/DownloadPDFReport';
import getCN from 'classnames';
import React from 'react';
import StatesRenderer from 'shared/components/states-renderer/StatesRenderer';
import URLConstants from 'shared/util/url-constants';
import {CSVType} from 'shared/components/download-report/utils';
import {getMatchedRoute, Routes as Path, toRoute} from 'shared/util/router';
import {Outlet, useParams} from 'react-router';
import {useChannelContext} from 'shared/context/channel';
import {useCurrentUser} from 'shared/hooks/useCurrentUser';
import {useDataSource} from 'shared/hooks/useDataSource';

const NAV_ITEMS = [
	{
		label: Liferay.Language.get('overview'),
		route: Path.SITES
	},
	{
		label: Liferay.Language.get('pages'),
		route: Path.SITES_TOUCHPOINTS
	},
	{
		label: Liferay.Language.get('interests'),
		route: Path.SITES_INTERESTS
	},
	{
		label: Liferay.Language.get('search-terms'),
		route: Path.SITES_SEARCH_TERMS
	}
];

type RouterParams = {
	channelId: string;
	groupId: string;
};

type Router = {
	params: RouterParams;
	query: object;
};

interface IDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
	router: Router;
}

export const Dashboard: React.FC<IDashboardProps> = ({router}) => {
	const {channelId, groupId} = useParams();

	const dataSourceStates = useDataSource();
	const {selectedChannel} = useChannelContext();
	const currentUser = useCurrentUser();

	const authorized = currentUser.isAdmin();
	const selectedChannelName = selectedChannel && selectedChannel.name;
	const matchedRoute = getMatchedRoute(NAV_ITEMS);

	return (
		<BasePage
			className='sites-dashboard-root'
			documentTitle={Liferay.Language.get('sites')}
		>
			<BasePage.Header
				breadcrumbs={[
					breadcrumbs.getHome({
						channelId,
						groupId,
						label: selectedChannelName
					})
				]}
				groupId={groupId}
			>
				<BasePage.Header.TitleSection
					className={getCN({'no-sites-connected': !selectedChannel})}
					title={
						selectedChannel
							? Liferay.Language.get('sites')
							: Liferay.Language.get('no-sites-connected')
					}
				/>

				<BasePage.Header.NavBar
					items={NAV_ITEMS}
					routeParams={{channelId, groupId}}
				/>
			</BasePage.Header>

			{matchedRoute !== Path.SITES_INTERESTS && (
				<BasePage.SubHeader>
					<div className='d-flex justify-content-end w-100'>
						{matchedRoute === Path.SITES && (
							<DownloadPDFReport
								disabled={dataSourceStates.empty}
								subtitle={selectedChannelName}
								title={Liferay.Language.get('sites-dashboard')}
							/>
						)}

						{matchedRoute === Path.SITES_SEARCH_TERMS && (
							<DownloadCSVReport
								disabled={dataSourceStates.empty}
								type={CSVType.SearchTerms}
								typeLang={Liferay.Language.get('search-terms')}
							/>
						)}

						{matchedRoute === Path.SITES_TOUCHPOINTS && (
							<DownloadCSVReport
								disabled={dataSourceStates.empty}
								type={CSVType.Page}
								typeLang={Liferay.Language.get('pages')}
							/>
						)}
					</div>
				</BasePage.SubHeader>
			)}

			<BasePage.Context.Provider
				value={{
					filters: {},
					router
				}}
			>
				<BasePage.Body>
					<StatesRenderer {...dataSourceStates}>
						<StatesRenderer.Empty
							description={
								<>
									{authorized
										? Liferay.Language.get(
												'connect-a-data-source-with-sites-data'
										  )
										: Liferay.Language.get(
												'please-contact-your-workspace-administrator-to-add-data-sources'
										  )}

									<ClayLink
										className='d-block mb-3'
										href={URLConstants.DataSourceConnection}
										key='DOCUMENTATION'
										target='_blank'
									>
										{Liferay.Language.get(
											'access-our-documentation-to-learn-more'
										)}
									</ClayLink>

									{authorized && (
										<ClayLink
											button
											className='button-root'
											displayType='primary'
											href={toRoute(
												Path.SETTINGS_DATA_SOURCE_LIST,
												{
													groupId
												}
											)}
										>
											{Liferay.Language.get(
												'connect-data-source'
											)}
										</ClayLink>
									)}
								</>
							}
							displayCard
							title={Liferay.Language.get(
								'no-sites-synced-from-data-sources'
							)}
						/>

						<StatesRenderer.Success>
							<Outlet />
						</StatesRenderer.Success>
					</StatesRenderer>
				</BasePage.Body>
			</BasePage.Context.Provider>
		</BasePage>
	);
};

export default Dashboard;

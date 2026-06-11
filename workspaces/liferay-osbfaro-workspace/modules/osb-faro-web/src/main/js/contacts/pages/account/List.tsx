/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import Link from '@clayui/link';
import TotalAccounts from 'contacts/components/account/TotalAccounts';
import {isNil} from 'lodash/fp';
import React from 'react';
import * as API from 'shared/api';
import AccountsDataSet from 'shared/components/AccountsDataSet';
import Loading from 'shared/components/Loading';
import NoResultsDisplay from 'shared/components/NoResultsDisplay';
import {SectionHeader} from 'shared/components/SectionHeader';
import BasePage from 'shared/components/base-page';
import {useChannelContext} from 'shared/context/channel';
import {useCurrentUser} from 'shared/hooks/useCurrentUser';
import {useRequest} from 'shared/hooks/useRequest';
import * as breadcrumbs from 'shared/util/breadcrumbs';
import {Sizes} from 'shared/util/constants';
import {Routes, toRoute} from 'shared/util/router';
import URLConstants from 'shared/util/url-constants';

interface IListProps {
	channelId: string;
	groupId: string;
}

const List: React.FC<IListProps> = ({channelId, groupId}) => {
	const currentUser = useCurrentUser();
	const {selectedChannel} = useChannelContext();

	const {data: dataSourceData, loading: dataSourceLoading} = useRequest({
		dataSourceFn: API.dataSource.fetchChannels,
		variables: {
			channelIds: [channelId],
			groupId,
		},
	});

	const authorized = currentUser.isAdmin();

	const dataSourceConnected =
		!isNil(dataSourceData?.total) && dataSourceData?.total > 0;

	const NoDataSourcesConnected = () => (
		<NoResultsDisplay
			description={
				<>
					{Liferay.Language.get(
						'connect-a-data-source-to-start-syncing-accounts'
					)}

					{authorized && (
						<>
							<p>
								<Link
									className="d-block mb-3"
									href={URLConstants.DataSourceConnection}
									key="DOCUMENTATION"
									target="_blank"
								>
									{Liferay.Language.get(
										'access-our-documentation-to-learn-more'
									)}
								</Link>
							</p>
							<Link
								button
								className="button-root"
								displayType="primary"
								href={toRoute(
									Routes.SETTINGS_DATA_SOURCE_LIST,
									{
										groupId,
									}
								)}
							>
								{Liferay.Language.get('connect-data-source')}
							</Link>
						</>
					)}
				</>
			}
			displayCard
			icon={{
				border: false,
				size: Sizes.XXXLarge,
				symbol: 'ac_satellite',
			}}
			spacer
			title={Liferay.Language.get('no-data-sources-connected')}
		/>
	);

	if (dataSourceLoading) {
		return <Loading />;
	}

	return (
		<BasePage documentTitle={Liferay.Language.get('accounts')}>
			<BasePage.Header
				breadcrumbs={[
					breadcrumbs.getHome({
						channelId,
						groupId,
						label: selectedChannel && selectedChannel.name,
					}),
				]}
				groupId={groupId}
			>
				<BasePage.Row>
					<BasePage.Header.TitleSection
						title={Liferay.Language.get('accounts')}
					/>
				</BasePage.Row>
			</BasePage.Header>
			<BasePage.Body>
				{dataSourceConnected ? (
					<>
						<TotalAccounts groupId={groupId} />

						<SectionHeader
							icon="box-container"
							title={Liferay.Language.get('accounts')}
						/>

						<AccountsDataSet
							apiURL={`/o/faro/contacts/${groupId}/account/search?channelId=${channelId}`}
							channelId={channelId}
							groupId={groupId}
						/>
					</>
				) : (
					<NoDataSourcesConnected />
				)}
			</BasePage.Body>
		</BasePage>
	);
};

export default List;

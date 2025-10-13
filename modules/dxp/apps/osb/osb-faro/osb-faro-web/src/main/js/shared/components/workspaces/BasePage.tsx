import * as API from 'shared/api';
import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import DocumentTitle from 'shared/components/DocumentTitle';
import getCN from 'classnames';
import React from 'react';
import UserDropdown from 'shared/components/user-dropdown';
import {Align} from '@clayui/drop-down';
import {LANGUAGES} from 'shared/util/constants';
import {Routes} from 'shared/util/router';
import {useCurrentUser} from '../../../AppContext';

interface IWorkspaceBasePageProps extends React.HTMLAttributes<HTMLElement> {
	backLabel?: string;
	backURL?: string;
	details?: React.ReactNode;
	title?: string;
}

const WorkspacesBasePage: React.FC<IWorkspaceBasePageProps> = ({
	backLabel = Liferay.Language.get('back'),
	backURL = '',
	children,
	className,
	details,
	title
}) => {
	const currentUser = useCurrentUser();

	const {emailAddress, languageId, screenName} = currentUser;

	return (
		<div className={getCN('workspaces-base-page-root', className)}>
			<DocumentTitle title={title} />

			<div className='header-container'>
				<ClayLink href='https://liferay.com' target='_blank'>
					<ClayIcon
						className='icon-root liferay-logo'
						symbol='liferay_logo'
					/>
				</ClayLink>

				<UserDropdown
					alignmentPosition={Align.BottomRight}
					initialActiveMenu='base'
					menus={{
						base: [
							{
								items: [
									{
										childMenuId: 'language',
										divider: true,
										label: Liferay.Language.get('language')
									},
									{
										externalLink: true,
										label: Liferay.Language.get('account'),
										url: `https://web.liferay.com/web/${screenName}/account-settings`
									},
									{
										externalLink: true,
										label: Liferay.Language.get('sign-out'),
										url: Routes.LOGOUT
									}
								],
								subheaderLabel: emailAddress
							}
						],
						language: [
							{
								items: LANGUAGES.map(({id, label}) => {
									const active = languageId === id;

									return {
										active,
										label,
										onClick: active
											? null
											: () =>
													API.user
														.updateLanguage({
															languageId: id
														})
														.then(() =>
															window.location.reload()
														)
									};
								})
							}
						]
					}}
					showCaret
					userName={currentUser.name}
				/>
			</div>

			<div className='content'>
				<div className='content-container'>
					{backURL && (
						<div className='back-container'>
							<ClayLink
								className='button-root'
								displayType='unstyled'
								href={backURL}
								type='button'
							>
								<ClayIcon
									className='icon-root'
									symbol='angle-left-small'
								/>

								{backLabel}
							</ClayLink>
						</div>
					)}

					<div className='title-container'>
						<div className='logo-container'>
							<ClayIcon
								className='icon-root logo-icon'
								symbol='ac_logo'
							/>

							<span className='logo-text'>
								{Liferay.Language.get('analytics-cloud')}
							</span>
						</div>

						{title && <h1 className='title'>{title}</h1>}

						{details && (
							<div className='details-container'>{details}</div>
						)}
					</div>

					{children}
				</div>
			</div>
		</div>
	);
};

export default WorkspacesBasePage;

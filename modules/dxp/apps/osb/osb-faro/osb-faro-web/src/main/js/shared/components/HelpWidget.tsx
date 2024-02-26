import ClayButton from '@clayui/button';
import ClayDropDown, {Align} from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import React from 'react';
import URLConstants from 'shared/util/url-constants';
import {Modal} from 'shared/types';
import {PLANS} from 'shared/util/subscriptions';
import {useModal} from 'shared/hooks/useModal';

const HelpWidget = ({groupId, project}) => {
	const {close, open} = useModal();
	const basicTier = project.faroSubscription.get('name') === PLANS.basic.name;

	return (
		<div className='help-widget-root'>
			<ClayDropDown
				alignmentPosition={Align.TopLeft}
				menuElementAttrs={{
					className: 'help-dropdown-root'
				}}
				trigger={
					<ClayButton
						aria-label={Liferay.Language.get('help')}
						borderless
						className='button-root help-button'
						displayType='info'
						size='sm'
					>
						<ClayIcon
							className='icon-root'
							symbol='ac-question-mark'
						/>
					</ClayButton>
				}
			>
				{basicTier ? (
					<ClayDropDown.Item>
						<ClayButton
							displayType='unstyled'
							onClick={() => {
								open(Modal.modalTypes.HELP_WIDGET_MODAL, {
									groupId,
									onClose: close
								});
							}}
						>
							{Liferay.Language.get('report-an-issue')}
						</ClayButton>
					</ClayDropDown.Item>
				) : (
					<ClayDropDown.Item>
						<ClayLink
							className='btn btn-unstyled w-100'
							href={URLConstants.TicketPageLink}
							onClick={() => {
								analytics.track(
									'Clicked Paid Tier Ticket Link',
									{
										currentUrl: window.location.href
									}
								);
							}}
							target='_blank'
						>
							{Liferay.Language.get('report-an-issue')}
						</ClayLink>
					</ClayDropDown.Item>
				)}

				<ClayDropDown.Item>
					<ClayLink
						className='btn btn-unstyled w-100'
						href={URLConstants.DocumentationLink}
						onClick={() => {
							analytics.track('Clicked Help Center Link', {
								currentUrl: window.location.href
							});
						}}
						target='_blank'
					>
						{Liferay.Language.get('help-center')}
					</ClayLink>
				</ClayDropDown.Item>
			</ClayDropDown>
		</div>
	);
};

export default HelpWidget;

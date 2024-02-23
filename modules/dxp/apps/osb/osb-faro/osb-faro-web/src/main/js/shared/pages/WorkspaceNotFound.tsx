import Card from 'shared/components/Card';
import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import getCN from 'classnames';
import React from 'react';
import WorkspacesBasePage from 'shared/components/workspaces/BasePage';
import {Routes} from 'shared/util/router';
import {Text} from '@clayui/core';

const WorkspaceNotFound: React.FC<React.HTMLAttributes<HTMLElement>> = ({
	className
}) => (
	<WorkspacesBasePage
		className={getCN('workspace-not-found-root text-center', className)}
	>
		<Card>
			<Card.Body>
				<div className='mb-3'>
					<Text size={8} weight='bold'>
						<ClayIcon
							className='icon-root text-danger mr-2'
							symbol='exclamation-circle'
						/>

						{Liferay.Language.get('workspace-error')}
					</Text>
				</div>

				<div className='mb-3 mx-6'>
					<Text>
						{Liferay.Language.get(
							'either-this-workspace-doesnt-exist-or-you-dont-have-access-to-it'
						)}
					</Text>

					<br />

					<Text>
						{Liferay.Language.get(
							'make-sure-youve-typed-the-correct-workspace-url-or-check-with-the-workspace-administrator-for-access'
						)}
					</Text>
				</div>

				<div className='d-flex justify-content-center'>
					<ClayLink
						button
						className='button-root'
						displayType='secondary'
						href={Routes.WORKSPACES}
					>
						{Liferay.Language.get('go-back-to-your-workspaces')}
					</ClayLink>
				</div>
			</Card.Body>
		</Card>
	</WorkspacesBasePage>
);

export default WorkspaceNotFound;

import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import ClayLink from '@clayui/link';
import getCN from 'classnames';
import Loading from 'shared/components/Loading';
import Modal from 'shared/components/modal';
import React, {useState} from 'react';
import {ClayInput} from '@clayui/form';
import {DataSourceStates} from 'shared/util/constants';
import {getPlanLabel} from 'shared/util/subscriptions';
import {Modal as ModalTypes} from 'shared/types';
import {Routes, toRoute} from 'shared/util/router';
import {useFetchProjects} from 'shared/hooks/useProjects';

const getWorkspaceURL = ({
	friendlyURL,
	groupId,
}: {
	friendlyURL?: string | null;
	groupId: string;
}) =>
	toRoute(Routes.WORKSPACE_WITH_ID, {
		groupId: friendlyURL ? friendlyURL.replace('/', '') : groupId,
	});

interface ISwitchWorkspaceModalProps {
	groupId: string;
	onClose: ModalTypes.close;
}

const SwitchWorkspaceModal: React.FC<ISwitchWorkspaceModalProps> = ({
	groupId,
	onClose,
}) => {
	const {data: projects, loading} = useFetchProjects();

	const [query, setQuery] = useState('');

	const workspaces = projects
		.filter(
			(project) =>
				project.get('groupId') &&
				project.get('state') !== DataSourceStates.Unconfigured
		)
		.map((project) => {
			const friendlyURL = project.get('friendlyURL');
			const id = String(project.get('groupId'));

			return {
				current: id === groupId || friendlyURL === `/${groupId}`,
				id,
				name: project.get('name') as string,
				planLabel: getPlanLabel(
					project.getIn(['faroSubscription', 'name'])
				),
				url: getWorkspaceURL({friendlyURL, groupId: id}),
			};
		})
		.filter(({name}) =>
			name.toLowerCase().includes(query.trim().toLowerCase())
		);

	return (
		<Modal className="switch-workspace-modal">
			<Modal.Header
				onClose={onClose}
				title={Liferay.Language.get('switch-workspaces')}
			/>

			<Modal.Body>
				<ClayInput.Group className="mb-3">
					<ClayInput.GroupItem>
						<ClayInput
							aria-label={Liferay.Language.get('search')}
							autoFocus
							insetAfter
							onChange={(event) => setQuery(event.target.value)}
							placeholder={Liferay.Language.get('search')}
							type="text"
							value={query}
						/>

						<ClayInput.GroupInsetItem after tag="span">
							<ClayIcon symbol="search" />
						</ClayInput.GroupInsetItem>
					</ClayInput.GroupItem>
				</ClayInput.Group>

				{loading ? (
					<Loading spacer />
				) : (
					<ul className="list-group switch-workspace-modal-list">
						{workspaces.map(({current, id, name, planLabel, url}) => {
							const content = (
								<>
									<div className="autofit-col autofit-col-expand">
										<div className="font-weight-semi-bold list-group-title text-truncate">
											{name}
										</div>

										{planLabel && (
											<div className="list-group-subtext">
												{planLabel}
											</div>
										)}
									</div>

									{current && (
										<div className="autofit-col">
											<ClayLabel displayType="info">
												{Liferay.Language.get(
													'current'
												)}
											</ClayLabel>
										</div>
									)}
								</>
							);

							return (
								<li
									className={getCN(
										'list-group-item list-group-item-flex',
										{
											'list-group-item-action': !current,
										}
									)}
									key={id}
								>
									{current ? (
										content
									) : (
										<a
											className="d-flex flex-grow-1 stretched-link text-decoration-none text-reset"
											href={url}
										>
											{content}
										</a>
									)}
								</li>
							);
						})}
					</ul>
				)}
			</Modal.Body>

			<Modal.Footer>
				<ClayLink href={toRoute(Routes.BASE)}>
					{Liferay.Language.get('view-all-workspaces')}

					<ClayIcon
						className="inline-item inline-item-after"
						symbol="angle-right"
					/>
				</ClayLink>
			</Modal.Footer>
		</Modal>
	);
};

export default SwitchWorkspaceModal;

import ClayButton from '@clayui/button';
import getCN from 'classnames';
import React from 'react';
import {DataSourceStates, MAX_LABEL_LENGTH} from 'shared/util/constants';
import {truncateText} from 'shared/util/util';
import {Icon, Option, Picker} from '@clayui/core';
import {Routes, toRoute} from 'shared/util/router';
import {useFetchProjects} from 'shared/hooks/useProjects';
import {useSelector} from 'react-redux';

const VIEW_ALL_KEY = 'view-all-workspaces';

type WorkspaceItem = {
	id: string;
	name: string;
	url: string;
};

interface ITriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
}

const Trigger = React.forwardRef<HTMLButtonElement, ITriggerProps>(
	({className, label, ...otherProps}, ref) => (
		<ClayButton
			{...otherProps}
			block
			className={getCN(
				'align-items-center d-flex rounded-lg workspaces-menu-trigger',
				{show: className?.split(' ').includes('show')}
			)}
			displayType="secondary"
			ref={ref}
		>
			<span className="flex-grow-1 font-weight-semi-bold text-left text-truncate">
				{label}
			</span>

			<Icon
				className="inline-item inline-item-after"
				symbol="caret-double"
			/>
		</ClayButton>
	)
);

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

interface IWorkspacesMenuProps {
	className?: string;
	groupId: string;
}

const WorkspacesMenu: React.FC<IWorkspacesMenuProps> = ({
	className,
	groupId,
}) => {
	const currentName = useSelector<any, string>((state) =>
		state.getIn(['projects', groupId, 'data', 'name'], '')
	);

	const {data: projects} = useFetchProjects();

	const workspaces: WorkspaceItem[] = projects
		.filter(
			(project) =>
				project.get('groupId') &&
				project.get('state') !== DataSourceStates.Unconfigured
		)
		.map((project) => ({
			id: String(project.get('groupId')),
			name: project.get('name'),
			url: getWorkspaceURL({
				friendlyURL: project.get('friendlyURL'),
				groupId: String(project.get('groupId')),
			}),
		}));

	const current = projects.find(
		(project) =>
			String(project.get('groupId')) === groupId ||
			project.get('friendlyURL') === `/${groupId}`
	);

	const selectedKey = current ? String(current.get('groupId')) : undefined;

	const items = [
		...workspaces,
		{
			id: VIEW_ALL_KEY,
			name: Liferay.Language.get('view-all-workspaces'),
			url: toRoute(Routes.BASE),
		},
	];

	return (
		<div className={getCN('workspaces-menu-root', className)}>
			<div className="workspaces-menu-label">
				{Liferay.Language.get('workspace')}
			</div>

			<Picker
				aria-label={Liferay.Language.get('workspace')}
				as={Trigger}
				items={items}
				label={current ? current.get('name') : currentName}
				onSelectionChange={(key) => {
					const selected = items.find(({id}) => id === String(key));

					if (!selected || selected.id === selectedKey) {
						return;
					}

					window.location.assign(selected.url);
				}}
				searchable
				selectedKey={selectedKey}
			>
				{(item) => (
					<Option key={item.id} textValue={item.name}>
						{item.id === VIEW_ALL_KEY ? (
							<span className="workspaces-menu-view-all">
								{item.name}
							</span>
						) : (
							truncateText(item.name, MAX_LABEL_LENGTH, null)
						)}
					</Option>
				)}
			</Picker>
		</div>
	);
};

export default WorkspacesMenu;

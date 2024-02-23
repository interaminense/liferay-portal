import AddWorkspaceForm from 'shared/components/workspaces/AddWorkspaceForm';
import getCN from 'classnames';
import React, {useState} from 'react';
import WorkspacesBasePage from 'shared/components/workspaces/BasePage';
import {addAlert} from 'shared/actions/alerts';
import {Alert} from 'shared/types';
import {compose, redirectIf} from 'shared/hoc';
import {
	configureProject,
	createProject,
	createTrialProject
} from 'shared/actions/projects';
import {connect} from 'react-redux';
import {DataSourceStates} from 'shared/util/constants';
import {Redirect} from 'react-router';
import {Routes, toRoute} from 'shared/util/router';
import {useProject} from 'shared/hooks/useProject';

export const routingFn = ({project}) => {
	if (
		project &&
		project.groupId &&
		project.state !== DataSourceStates.Unconfigured
	) {
		return toRoute(Routes.WORKSPACE_WITH_ID, {groupId: project.groupId});
	} else {
		return null;
	}
};

export const AddWorkspace = ({
	addAlert,
	className,
	configureProject,
	corpProjectUuid,
	createProject,
	createTrialProject,
	project
}) => {
	const [redirectToWorkspace, setRedirectToWorkspace] = useState(false);
	const [friendlyURL, setFriendlyURL] = useState('');

	const handleSubmit = ({
		emailAddressDomains,
		friendlyURL,
		incidentReportEmailAddresses,
		name,
		serverLocation,
		timeZoneId
	}) => {
		const project = useProject();

		const params = {
			emailAddressDomains,
			friendlyURL: friendlyURL && `/${friendlyURL}`,
			incidentReportEmailAddresses,
			name,
			timeZoneId,
			...(project.state === DataSourceStates.Unconfigured
				? {groupId: project.groupId}
				: {corpProjectUuid, serverLocation})
		};

		const createFn =
			project.state === DataSourceStates.Unconfigured
				? configureProject
				: corpProjectUuid
				? createProject
				: createTrialProject;

		return createFn(params)
			.then(({payload: {friendlyURL, groupId, name}}) => {
				analytics.track(
					'Created Workspace',
					{
						createDate: Date.now(),
						groupId: String(groupId),
						serverLocation,
						workspaceName: name
					},
					{ip: '0'}
				);

				setRedirectToWorkspace(true);
				setFriendlyURL(
					friendlyURL ? friendlyURL.replace('/', '') : groupId
				);

				addAlert({
					alertType: Alert.Types.Success,
					message: Liferay.Language.get('success')
				});
			})
			.catch(error => {
				if (!error.field) {
					addAlert({
						alertType: Alert.Types.Error,
						message: error.message,
						timeout: false
					});
				}

				return Promise.reject(error);
			});
	};

	return (
		<div
			className={getCN('add-workspace-root', className)}
			key='AddWorkspace'
		>
			{redirectToWorkspace ? (
				<Redirect
					to={toRoute(Routes.WORKSPACE_WITH_ID, {
						groupId: friendlyURL
					})}
				/>
			) : (
				<WorkspacesBasePage
					title={Liferay.Language.get('create-workspace')}
				>
					{/** @ts-ignore */}
					<AddWorkspaceForm
						onSubmit={handleSubmit}
						project={project}
					/>
				</WorkspacesBasePage>
			)}
		</div>
	);
};

export default compose(
	connect(null, {
		addAlert,
		configureProject,
		createProject,
		createTrialProject
	}),
	redirectIf(routingFn)
)(AddWorkspace);

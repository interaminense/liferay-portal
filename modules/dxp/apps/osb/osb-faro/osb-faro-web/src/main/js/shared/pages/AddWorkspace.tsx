import AddWorkspaceForm from 'shared/components/workspaces/AddWorkspaceForm';
import getCN from 'classnames';
import React, {useContext, useState} from 'react';
import WorkspacesBasePage from 'shared/components/workspaces/BasePage';
import {addAlert} from 'shared/actions/alerts';
import {Alert} from 'shared/types';
import {AppContext} from '../../AppContext';
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

const AddWorkspace = ({
	addAlert,
	className,
	configureProject,
	corpProjectUuid,
	createProject,
	createTrialProject
}) => {
	const [state, setState] = useState({
		friendlyURL: '',
		redirectToWorkspace: false
	});

	const {project} = useContext(AppContext);

	const handleSubmit = ({
		emailAddressDomains,
		friendlyURL,
		incidentReportEmailAddresses,
		name,
		serverLocation,
		timeZoneId
	}) => {
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
			.then(({payload: {friendlyURL, groupId}}) => {
				setState({
					friendlyURL: friendlyURL
						? friendlyURL.replace('/', '')
						: groupId,
					redirectToWorkspace: true
				});

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
			{state.redirectToWorkspace ? (
				<Redirect
					to={toRoute(Routes.WORKSPACE_WITH_ID, {
						groupId: state.friendlyURL
					})}
				/>
			) : (
				<WorkspacesBasePage
					title={Liferay.Language.get('create-workspace')}
				>
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

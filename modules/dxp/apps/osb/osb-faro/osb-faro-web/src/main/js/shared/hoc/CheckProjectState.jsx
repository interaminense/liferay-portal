import ActivatingDisplay from 'shared/components/workspaces/ActivatingDisplay';
import React from 'react';
import SuccessDisplay from 'shared/components/workspaces/SuccessDisplay';
import WorkspaceNotFound from 'shared/pages/WorkspaceNotFound';
import WorkspacesErrorDisplay from 'shared/components/workspaces/ErrorDisplay';
import {compose} from 'redux';
import {ProjectStates} from 'shared/util/constants';
import {useProject} from 'shared/hooks/useProject';

/**
 * HOC for conditionally rendering SettingUpWorkspace.
 * If the project state is not ready, we will render SettingUpWorkspace.
 * @returns {Function} - The new component
 */
export default compose(
	WrappedComponent => ({className, groupId, ...otherProps}) => {
		const project = useProject();

		if (!project) {
			return <WorkspaceNotFound />;
		}

		switch (project.state) {
			case ProjectStates.Ready:
			case ProjectStates.Scheduled:
				return (
					<WrappedComponent
						{...otherProps}
						className={className}
						groupId={groupId}
					/>
				);

			case ProjectStates.Deactivated:
			case ProjectStates.Maintenance:
			case ProjectStates.Unavailable:
				return (
					<WorkspacesErrorDisplay
						className={className}
						errorType={project.state}
					/>
				);

			case ProjectStates.Activating:
				return <ActivatingDisplay />;

			default:
				return (
					<SuccessDisplay
						friendlyURL={
							project.friendlyURL || `/${project.groupId}`
						}
					/>
				);
		}
	}
);

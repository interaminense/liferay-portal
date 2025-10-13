import ActivatingDisplay from 'shared/components/workspaces/ActivatingDisplay';
import Loading from 'shared/components/Loading';
import React, {useContext, useEffect} from 'react';
import SuccessDisplay from 'shared/components/workspaces/SuccessDisplay';
import WorkspacesErrorDisplay from 'shared/components/workspaces/ErrorDisplay';
import {AppContext} from '../../AppContext';
import {compose} from 'redux';
import {fetch as fetchProject} from 'shared/api/projects';
import {ProjectStates} from 'shared/util/constants';
import {usePolling} from 'shared/hooks/usePolling';

export default compose(
	WrappedComponent => ({className, groupId, ...otherProps}) => {
		const {project, setProject} = useContext(AppContext);

		const {data, error} = usePolling(
			() => fetchProject({groupId}),
			result => result.state !== ProjectStates.Activating,
			3000
		);

		useEffect(() => {
			if (data) {
				setProject(data);
			}
		}, [data, setProject]);

		if (!project && !data) {
			return <Loading spacer />;
		}

		if (error) {
			return (
				<WorkspacesErrorDisplay
					className={className}
					errorType={ProjectStates.Unavailable}
				/>
			);
		}

		const currentProject = data || project;

		switch (currentProject.state) {
			case ProjectStates.Ready:
			case ProjectStates.Scheduled:
				return (
					<WrappedComponent
						{...otherProps}
						className={className}
						groupId={groupId}
						project={currentProject}
					/>
				);

			case ProjectStates.Deactivated:
			case ProjectStates.Maintenance:
			case ProjectStates.Unavailable:
				return (
					<WorkspacesErrorDisplay
						className={className}
						errorType={currentProject.state}
					/>
				);

			case ProjectStates.Activating:
				return <ActivatingDisplay />;

			default:
				return (
					<SuccessDisplay
						friendlyURL={
							currentProject.friendlyURL || `/${groupId}`
						}
					/>
				);
		}
	}
);

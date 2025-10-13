import ClayAlert from '@clayui/alert';
import ClayLink from '@clayui/link';
import EmptyState from 'shared/components/workspaces/EmptyState';
import JoinableWorkspacesWrapper from 'shared/components/workspaces/JoinableWorkspacesWrapper';
import Loading from 'shared/components/Loading';
import React, {useEffect, useState} from 'react';
import URLConstants from 'shared/util/url-constants';
import WorkspaceList from 'shared/components/workspaces/workspace-list';
import WorkspacesBasePage from 'shared/components/workspaces/BasePage';
import {ENABLE_ADD_TRIAL_WORKSPACE} from 'shared/util/constants';
import {fetchJoinableProjects, fetchMany} from 'shared/api/projects';
import {isString} from 'lodash';
import {PLANS} from 'shared/util/subscriptions';
import {Project} from 'shared/util/records';
import {Redirect} from 'react-router';
import {Routes, toRoute} from 'shared/util/router';
import {useIncidentAlert} from 'shared/hooks/useIncidentAlert';

export const routingFn = ({projects}) => {
	if (projects.length === 1 && !projects[0].groupId) {
		return toRoute(Routes.WORKSPACE_ADD_WITH_CORP_PROJECT_UUID, {
			corpProjectUuid: projects[0].corpProjectUuid
		});
	}

	return null;
};

const WorkspaceContent = ({joinableProjects, projects}) => {
	const filteredProjects = projects.filter(
		({faroSubscription, groupId}) =>
			faroSubscription.get('name') !== PLANS.basic.name || groupId
	);

	return (
		<>
			{!!filteredProjects.length && (
				<WorkspaceList
					accounts={filteredProjects}
					displayAccountHeaders
					displayPlanInfo
				/>
			)}

			{!!joinableProjects.length && (
				<JoinableWorkspacesWrapper
					details={Liferay.Language.get(
						'workspaces-you-can-request-access-to-based-on-your-email-domain'
					)}
					title={Liferay.Language.get('workspaces-you-can-join')}
				>
					<WorkspaceList
						accounts={joinableProjects}
						isJoinableProjects
					/>
				</JoinableWorkspacesWrapper>
			)}

			{ENABLE_ADD_TRIAL_WORKSPACE && (
				<div className='mt-4'>
					<ClayLink
						button
						className='button-root'
						displayType='secondary'
						href={toRoute(Routes.WORKSPACE_ADD_TRIAL)}
						small
					>
						{Liferay.Language.get('start-free-trial')}
					</ClayLink>
				</div>
			)}
		</>
	);
};

const Workspaces = () => {
	const {
		data: preferences,
		loading: loadingPreferences,
		onClose
	} = useIncidentAlert();

	const [loading, setLoading] = useState(true);
	const [projects, setProjects] = useState<Project[]>([]);
	const [joinableProjects, setJoinableProjects] = useState<Project[]>([]);

	useEffect(() => {
		async function fetch() {
			try {
				const projects = await fetchMany();
				const joinableProjects = await fetchJoinableProjects();

				setProjects(projects.map(project => new Project(project)));
				setJoinableProjects(joinableProjects);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('Error on fetch projects', error);
			}

			setLoading(false);
		}

		fetch();
	}, []);

	if (projects.length === 1 && !projects[0].groupId) {
		return toRoute(Routes.WORKSPACE_ADD_WITH_CORP_PROJECT_UUID, {
			corpProjectUuid: projects[0].corpProjectUuid
		});
	}

	const route = routingFn({projects});

	if (isString(route)) {
		return <Redirect push to={route} />;
	}

	return (
		<div className='workspaces-root' key='Workspaces'>
			<WorkspacesBasePage
				details={() => {
					if (projects.length) {
						return [
							<p key='SELECT'>
								{Liferay.Language.get(
									'workspaces-you-have-joined'
								)}
							</p>
						];
					} else if (
						!loading &&
						!projects.length &&
						!joinableProjects.length
					) {
						return [
							<p key='EMPTY_STATE'>
								{Liferay.Language.get(
									'you-are-not-a-part-of-any-workspaces,-lets-create-a-new-one'
								)}
							</p>
						];
					}
				}}
				title={Liferay.Language.get('your-workspaces')}
			>
				{!loadingPreferences && preferences.incidentAlertEnabled && (
					<ClayAlert
						displayType='warning'
						onClose={onClose}
						symbol='info-circle'
						title={Liferay.Language.get('warning')}
						variant='inline'
					>
						{Liferay.Language.get(
							'we-are-experiencing-changes-that-may-affect-your-workflow'
						)}

						<ClayLink
							className='ml-1'
							decoration='underline'
							href={URLConstants.HelpCenterAnnouncements}
							target='_blank'
						>
							{Liferay.Language.get(
								'visit-our-help-center-announcements-page-for-more-details'
							)}
						</ClayLink>
					</ClayAlert>
				)}

				{loading ? (
					<Loading spacer />
				) : !projects.length && !joinableProjects.length ? (
					<EmptyState />
				) : (
					<WorkspaceContent
						joinableProjects={joinableProjects}
						projects={projects}
					/>
				)}
			</WorkspacesBasePage>
		</div>
	);
};

export default Workspaces;

import {
	fetchProject,
	fetchProjectViaCorpProjectUuid
} from 'shared/actions/projects';
import {matchPath, useLocation, useParams} from 'react-router-dom';
import {Routes} from 'shared/util/router';
import {useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

export const useFetchProject = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const projects = useSelector<any, any>(state => state.get('projects'));
	const [loading, setLoading] = useState(true);

	const groupIdPath = matchPath<any>(location.pathname, {
		path: Routes.WORKSPACE_WITH_ID
	});

	const corpProjectUuidPath = matchPath<any>(location.pathname, {
		path: Routes.WORKSPACE_ADD_WITH_CORP_PROJECT_UUID
	});

	const groupId = groupIdPath?.params?.groupId;
	const corpProjectUuid = corpProjectUuidPath?.params?.corpProjectUuid;

	useEffect(() => {
		if (groupId) {
			dispatch(fetchProject({groupId}));
		} else if (corpProjectUuid) {
			dispatch(fetchProjectViaCorpProjectUuid({corpProjectUuid}));
		}

		setLoading(false);
	}, [dispatch, groupId, corpProjectUuid]);

	const project = projects.get(groupId || corpProjectUuid);

	return {
		data: project?.get('data'),
		loading: loading || project?.get('loading')
	};
};

export const useProject = (initialGroupId?: string) => {
	const {groupId} = useParams();
	const project = useSelector<any, any>(state =>
		state.getIn(['projects', initialGroupId || groupId, 'data'])
	);

	return project;
};

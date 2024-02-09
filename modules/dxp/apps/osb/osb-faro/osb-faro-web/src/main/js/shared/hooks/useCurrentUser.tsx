import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {fetchCurrentUser} from 'shared/actions/users';

export const useCurrentUser = () => {
	const {groupId} = useParams();
	const dispatch = useDispatch();
	const state = useSelector<any, any>(state => state);
	const currentUserId = state.getIn(['currentUser', 'data']);

	useEffect(() => {
		if (!currentUserId) {
			dispatch(fetchCurrentUser(groupId));
		}
	}, [currentUserId, dispatch]);

	return state.getIn(['users', currentUserId, 'data']);
};

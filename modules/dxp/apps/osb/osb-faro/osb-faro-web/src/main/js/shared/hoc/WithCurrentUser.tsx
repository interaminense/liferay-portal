import React from 'react';
import {useCurrentUser} from '../../AppContext';

/**
 * CurrentUser HOC
 * @deprecated Use useCurrentUser Hook for functional components.
 */
export default Component => props => {
	const currentUser = useCurrentUser();

	return <Component {...props} currentUser={currentUser} />;
};

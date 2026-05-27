import React from 'react';
import {useHistory} from 'react-router-dom';

export default WrappedComponent => props => {
	const history = useHistory();

	return <WrappedComponent history={history} {...props} />;
};

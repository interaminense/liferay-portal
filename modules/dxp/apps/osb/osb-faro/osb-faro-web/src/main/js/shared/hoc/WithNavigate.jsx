import React from 'react';
import {useNavigate} from 'react-router';

export default WrappedComponent => props => {
	const navigate = useNavigate();

	return <WrappedComponent {...props} navigate={navigate} />;
};

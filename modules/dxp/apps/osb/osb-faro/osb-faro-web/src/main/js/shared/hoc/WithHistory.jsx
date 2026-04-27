import React from 'react';
import withRouter from './WithRouter';

/**
 * Adds history prop using the local withRouter shim (react-router v7 compatible).
 */
export default WrappedComponent =>
	withRouter(({history, ...otherProps}) => (
		<WrappedComponent history={history} {...otherProps} />
	));

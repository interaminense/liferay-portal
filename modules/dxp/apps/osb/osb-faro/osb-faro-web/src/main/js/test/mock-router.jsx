import React from 'react';
import {BrowserRouter} from 'react-router';

export default {
	params: {},
	query: {}
};

export function withBrowserRouter(Component) {
	return props => (
		<BrowserRouter>
			<Component {...props} />
		</BrowserRouter>
	);
}

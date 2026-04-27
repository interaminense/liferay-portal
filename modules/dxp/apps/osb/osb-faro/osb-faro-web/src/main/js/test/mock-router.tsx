import React from 'react';
import {StaticRouter} from 'react-router-dom';

export default {
	params: {},
	query: {}
};

export function withStaticRouter(Component: React.ComponentType<any>) {
	return (props: Record<string, unknown>) => (
		<StaticRouter location='/'>
			<Component {...props} />
		</StaticRouter>
	);
}

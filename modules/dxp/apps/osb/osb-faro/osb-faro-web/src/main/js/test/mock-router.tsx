import React from 'react';
import {
	createMemoryRouter,
	RouterProvider,
	StaticRouter
} from 'react-router-dom';

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

export function withDataRouter(
	children: React.ReactElement,
	{
		initialEntries = ['/'],
		path = '*'
	}: {initialEntries?: string[]; path?: string} = {}
): React.ReactElement {
	const initial = initialEntries[0] ?? '/';
	const url = new URL(initial, 'http://localhost');

	Object.defineProperty(window, 'location', {
		configurable: true,
		value: {
			...window.location,
			hash: url.hash,
			href: url.href,
			origin: url.origin,
			pathname: url.pathname,
			search: url.search
		}
	});

	const router = createMemoryRouter([{element: children, path}], {
		initialEntries
	});

	return <RouterProvider router={router} />;
}

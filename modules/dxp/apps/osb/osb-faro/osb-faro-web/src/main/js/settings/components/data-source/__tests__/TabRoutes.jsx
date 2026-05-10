import React from 'react';
import TabRoutes from '../TabRoutes';
import {render} from '@testing-library/react';
import {withDataRouter} from 'test/mock-router';

jest.unmock('react-dom');

describe('TabRoutes', () => {
	it('should render', () => {
		const Component = () => <div>{'Foo Bar'}</div>;

		const {container, getByText} = render(
			withDataRouter(
				<TabRoutes
					routes={[{component: Component, path: '/foo/path'}]}
				/>,
				{initialEntries: ['/foo/path']}
			)
		);

		expect(getByText('Foo Bar')).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});

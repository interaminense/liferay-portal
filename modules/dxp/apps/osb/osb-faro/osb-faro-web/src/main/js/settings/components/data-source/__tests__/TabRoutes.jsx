import React from 'react';
import TabRoutes from '../TabRoutes';
import {BrowserRouter} from 'react-router';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

describe('TabRoutes', () => {
	it('should render', () => {
		const Component = () => <div>{'Foo Bar'}</div>;

		const {container, getByText} = render(
			<BrowserRouter location='foo/path'>
				<TabRoutes
					routes={[{component: Component, path: 'foo/path'}]}
				/>
			</BrowserRouter>
		);

		expect(getByText('Foo Bar')).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});

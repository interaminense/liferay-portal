import HeaderCell from '../HeaderCell';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {StaticRouter} from 'react-router';

jest.unmock('react-dom');

describe('HeaderCell', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<HeaderCell>
				<p>{'children'}</p>
			</HeaderCell>
		);

		expect(container).toMatchSnapshot();
	});

	it('should render with sort disabled', () => {
		const {container} = render(<HeaderCell sortable={false} />);

		expect(container.querySelector('.button-root')).toBeFalsy();
	});

	it('should render the header cell as a link if headerLink is true', () => {
		const {container} = render(
			<StaticRouter>
				<HeaderCell headerLink />
			</StaticRouter>
		);

		expect(container.querySelector('.button-root')).toHaveAttribute(
			'href',
			'/?page=1&sortOrder=ASC'
		);
	});
});

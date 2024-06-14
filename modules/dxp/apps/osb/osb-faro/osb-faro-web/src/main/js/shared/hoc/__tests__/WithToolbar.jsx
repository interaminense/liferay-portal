import React from 'react';
import withToolbar from '../WithToolbar';
import {cleanup, render} from '@testing-library/react';
import {compose} from 'redux';
import {withStaticRouter} from 'test/mock-router';

jest.unmock('react-dom');

describe('withToolbar', () => {
	afterEach(cleanup);

	it('renders', () => {
		const WrappedComponent = compose(
			withStaticRouter,
			withToolbar({showRangeDropdownKey: true})
		)(() => <div>{'foobar'}</div>);

		const {container} = render(<WrappedComponent />);

		expect(container).toMatchSnapshot();
	});
});

import React from 'react';
import withSheet from '../WithSheet';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('withSheet', () => {
	afterEach(cleanup);

	it('should render', () => {
		const WrappedComponent = withSheet({large: true})(() => (
			<p>{'Test Test'}</p>
		));

		const {container} = render(<WrappedComponent />);

		expect(container).toMatchSnapshot();
	});
});

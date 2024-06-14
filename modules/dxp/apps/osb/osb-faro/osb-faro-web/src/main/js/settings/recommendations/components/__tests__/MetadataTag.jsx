import MetadataTag from '../MetadataTag';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('MetadataTag', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<MetadataTag value='og:url' />);

		expect(container).toMatchSnapshot();
	});
});

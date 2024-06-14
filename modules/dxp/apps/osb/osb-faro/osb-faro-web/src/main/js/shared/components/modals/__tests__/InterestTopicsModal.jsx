import InterestTopicsModal from '../InterestTopicsModal';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {noop} from 'lodash';

jest.unmock('react-dom');

describe('InterestTopicsModal', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<InterestTopicsModal onClose={noop} />);

		expect(container).toMatchSnapshot();
	});
});

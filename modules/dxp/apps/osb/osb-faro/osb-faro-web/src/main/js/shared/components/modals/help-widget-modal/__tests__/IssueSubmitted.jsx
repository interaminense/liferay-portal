import IssueSubmitted from '../IssueSubmitted';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {noop} from 'lodash';

jest.unmock('react-dom');

describe('IssueSubmitted', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<IssueSubmitted onClose={noop} onNext={noop} />
		);

		expect(container).toMatchSnapshot();
	});
});

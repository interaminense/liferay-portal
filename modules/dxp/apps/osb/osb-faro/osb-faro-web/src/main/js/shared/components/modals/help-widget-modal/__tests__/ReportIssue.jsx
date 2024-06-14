import mockStore from 'test/mock-store';
import React from 'react';
import ReportIssue from '../ReportIssue';
import {cleanup, render} from '@testing-library/react';
import {Provider} from 'react-redux';

jest.unmock('react-dom');

describe('ReportIssue', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container, queryByText} = render(
			<Provider store={mockStore()}>
				<ReportIssue onClose={jest.fn()} onNext={jest.fn()} />
			</Provider>
		);

		expect(queryByText('Issue Title')).toBeTruthy();
		expect(queryByText('Description')).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});

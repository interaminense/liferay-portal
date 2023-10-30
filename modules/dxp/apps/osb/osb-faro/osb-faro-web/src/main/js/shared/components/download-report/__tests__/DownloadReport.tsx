import React from 'react';
import {DownloadReport} from '../DownloadReport';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

describe('DownloadReport', () => {
	it('renders component', () => {
		const {container, getByText} = render(
			<DownloadReport title='Test Report' />
		);

		expect(getByText(/download/i)).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});
});

import CSVPreviewModal from '../CSVPreviewModal';
import React from 'react';
import {cleanup, render, waitFor} from '@testing-library/react';
import {noop} from 'lodash';

jest.unmock('react-dom');

describe('CSVPreviewModal', () => {
	afterEach(cleanup);

	it('should render', async () => {
		const {container} = render(
			<CSVPreviewModal
				fileName='test'
				groupId='23'
				id='test'
				onClose={noop}
			/>
		);

		await waitFor(() => {});

		expect(container).toMatchSnapshot();
	});

	it('should render with a title on the heading', () => {
		const {getByText} = render(
			<CSVPreviewModal
				fileName='test'
				groupId='23'
				id='test'
				name='Liferay Test'
				onClose={noop}
			/>
		);

		expect(getByText('Data Preview "Liferay Test"')).toBeTruthy();
	});
});

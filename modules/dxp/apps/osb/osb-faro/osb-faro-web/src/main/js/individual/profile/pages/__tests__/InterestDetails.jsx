import * as data from 'test/data';
import InterestDetails from '../InterestDetails';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {Individual} from 'shared/util/records';
import {render} from '@testing-library/react';
import {waitForLoadingToBeRemoved} from 'test/helpers';

const defaultProps = {
	active: 'true',
	groupId: '23',
	id: 'test',
	individual: new Individual(data.mockIndividual()),
	interestId: 1
};

jest.unmock('react-dom');

describe('InterestDetails', () => {
	it('should render', async () => {
		const {container} = render(
			<BrowserRouter>
				<InterestDetails {...defaultProps} />
			</BrowserRouter>
		);

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});

	it('should render an active pages list tab', async () => {
		const {container, getByText} = render(
			<BrowserRouter>
				<InterestDetails {...defaultProps} />
			</BrowserRouter>
		);

		await waitForLoadingToBeRemoved(container);

		expect(getByText('Active Pages')).toBeTruthy();
		expect(getByText('Active Pages').parentElement).toHaveClass('active');
	});

	it('should render an inactive pages list tab', async () => {
		const {container, getByText} = render(
			<BrowserRouter>
				<InterestDetails {...defaultProps} active='false' />
			</BrowserRouter>
		);

		await waitForLoadingToBeRemoved(container);

		expect(getByText('Inactive Pages')).toBeTruthy();
		expect(getByText('Inactive Pages').parentElement).toHaveClass('active');
	});
});

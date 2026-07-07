import React from 'react';
import SalesforceSyncItems from '../SalesforceSyncItems';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';

jest.unmock('react-dom');

describe('SalesforceSyncItems', () => {
	afterEach(cleanup);

	it('should render the three sync entities', () => {
		render(<SalesforceSyncItems onSelect={() => {}} />);

		expect(screen.getByText('Individuals')).toBeInTheDocument();
		expect(
			screen.getByText('Accounts and Opportunities')
		).toBeInTheDocument();
		expect(
			screen.getByText('Campaigns and Campaign Members')
		).toBeInTheDocument();
	});

	it('should call onSelect with the entity key when its Select button is clicked', () => {
		const onSelect = jest.fn();

		render(<SalesforceSyncItems onSelect={onSelect} />);

		fireEvent.click(screen.getAllByText('Select')[0]);

		expect(onSelect).toHaveBeenCalledWith('individuals');
	});

	it('should show synced counts only when itemsSyncedCounts is provided', () => {
		const {rerender} = render(<SalesforceSyncItems onSelect={() => {}} />);

		expect(screen.queryByText(/Items Synced/)).not.toBeInTheDocument();

		rerender(
			<SalesforceSyncItems
				itemsSyncedCounts={{
					accountsAndOpportunities: 293,
					campaignsAndCampaignMembers: 0,
					individuals: 8900,
				}}
				onSelect={() => {}}
			/>
		);

		expect(screen.getByText(/8.9K Items Synced/)).toBeInTheDocument();
	});
});

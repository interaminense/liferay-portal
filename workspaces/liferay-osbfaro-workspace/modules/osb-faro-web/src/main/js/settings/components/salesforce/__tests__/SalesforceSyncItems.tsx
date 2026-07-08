import React from 'react';
import SalesforceSyncItems from '../SalesforceSyncItems';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';

jest.unmock('react-dom');

jest.mock('../SalesforceSyncFieldsModal', () => ({
	__esModule: true,
	default: ({
		entityKey,
		onDone,
	}: {
		entityKey: string;
		onDone: (count: number) => void;
	}) => (
		<div data-testid="sync-fields-modal">
			<span data-testid="modal-entity">{entityKey}</span>

			<button
				data-testid="modal-done"
				onClick={() => onDone(5)}
				type="button"
			>
				{'done'}
			</button>
		</div>
	),
}));

describe('SalesforceSyncItems', () => {
	afterEach(cleanup);

	it('should render the three sync entities', () => {
		render(<SalesforceSyncItems />);

		expect(screen.getByText('Individuals')).toBeInTheDocument();
		expect(
			screen.getByText('Accounts and Opportunities')
		).toBeInTheDocument();
		expect(
			screen.getByText('Campaigns and Campaign Members')
		).toBeInTheDocument();
	});

	it('should open the modal for the clicked entity', () => {
		render(<SalesforceSyncItems />);

		expect(
			screen.queryByTestId('sync-fields-modal')
		).not.toBeInTheDocument();

		fireEvent.click(screen.getAllByText('Select')[0]);

		expect(screen.getByTestId('sync-fields-modal')).toBeInTheDocument();
		expect(screen.getByTestId('modal-entity')).toHaveTextContent(
			'individuals'
		);
	});

	it('should update the selected count when the modal is done', () => {
		render(<SalesforceSyncItems />);

		fireEvent.click(screen.getAllByText('Select')[0]);
		fireEvent.click(screen.getByTestId('modal-done'));

		expect(screen.getByText(/5 items selected/)).toBeInTheDocument();
	});

	it('should show synced counts only when itemsSyncedCounts is provided', () => {
		const {rerender} = render(<SalesforceSyncItems />);

		expect(screen.queryByText(/items synced/)).not.toBeInTheDocument();

		rerender(
			<SalesforceSyncItems
				itemsSyncedCounts={{
					accountsAndOpportunities: 293,
					campaignsAndCampaignMembers: 0,
					individuals: 8900,
				}}
			/>
		);

		expect(screen.getByText(/8.9K items synced/)).toBeInTheDocument();
	});
});

import React from 'react';
import SalesforceSyncItems from '../SalesforceSyncItems';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {useRequest} from 'shared/hooks/useRequest';

jest.unmock('react-dom');

jest.mock('shared/hooks/useRequest', () => ({
	useRequest: jest.fn(),
}));

jest.mock('shared/api/data-source', () => ({
	fetchSalesforceFieldCatalog: jest.fn(),
}));

jest.mock('../SalesforceSyncFieldsModal', () => ({
	__esModule: true,
	default: ({
		entityKey,
		onDone,
	}: {
		entityKey: string;
		onDone: (entitySelection: Record<string, string[]>) => void;
	}) => (
		<div data-testid="sync-fields-modal">
			<span data-testid="modal-entity">{entityKey}</span>

			<button
				data-testid="modal-done"
				onClick={() => onDone({CONTACT: ['a', 'b', 'c', 'd', 'e']})}
				type="button"
			>
				{'done'}
			</button>
		</div>
	),
}));

const CATALOG = {
	ACCOUNT: [
		{name: 'Name', required: false, selected: true, type: 'String'},
		{name: 'Type', required: false, selected: false, type: 'String'},
	],
	CONTACT: [
		{name: 'Email', required: false, selected: false, type: 'String'},
	],
	OPPORTUNITY: [
		{name: 'Amount', required: false, selected: true, type: 'Number'},
	],
};

const mockedUseRequest = useRequest as jest.Mock;

describe('SalesforceSyncItems', () => {
	beforeEach(() => {
		mockedUseRequest.mockReturnValue({data: CATALOG});
	});

	afterEach(cleanup);

	it('should render the three sync entities', () => {
		render(<SalesforceSyncItems dataSourceId="1" groupId="1" />);

		expect(screen.getByText('Individuals')).toBeInTheDocument();
		expect(
			screen.getByText('Accounts and Opportunities')
		).toBeInTheDocument();
		expect(
			screen.getByText('Campaigns and Campaign Members')
		).toBeInTheDocument();
	});

	it('should show the selected count from the field catalog', () => {
		render(<SalesforceSyncItems dataSourceId="1" groupId="1" />);

		expect(screen.getByText(/2 items selected/)).toBeInTheDocument();
	});

	it('should open the modal for the clicked entity', () => {
		render(<SalesforceSyncItems dataSourceId="1" groupId="1" />);

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
		render(<SalesforceSyncItems dataSourceId="1" groupId="1" />);

		fireEvent.click(screen.getAllByText('Select')[0]);
		fireEvent.click(screen.getByTestId('modal-done'));

		expect(screen.getByText(/5 items selected/)).toBeInTheDocument();
	});

	it('should show synced counts only when itemsSyncedCounts is provided', () => {
		const {rerender} = render(
			<SalesforceSyncItems dataSourceId="1" groupId="1" />
		);

		expect(screen.queryByText(/items synced/)).not.toBeInTheDocument();

		rerender(
			<SalesforceSyncItems
				dataSourceId="1"
				groupId="1"
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

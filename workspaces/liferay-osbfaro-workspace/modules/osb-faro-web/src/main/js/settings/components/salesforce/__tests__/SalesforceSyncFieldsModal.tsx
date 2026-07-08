import React from 'react';
import ReactDOM from 'react-dom';
import SalesforceSyncFieldsModal from '../SalesforceSyncFieldsModal';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';

jest.unmock('react-dom');

jest.mock('@liferay/frontend-data-set-web', () => ({
	...jest.requireActual('@liferay/frontend-data-set-web'),
	FrontendDataSet: ({
		id,
		onSelectedItemsChange,
		selectedItems
	}: {
		id: string;
		onSelectedItemsChange: (items: any[]) => void;
		selectedItems: any[];
	}) => (
		<div data-testid='fds' id={id}>
			<span data-testid={`fds-count-${id}`}>
				{(selectedItems ?? []).length}
			</span>

			<button
				data-testid={`fds-select-${id}`}
				onClick={() => onSelectedItemsChange([{name: 'Name'}])}
				type='button'
			>
				{'select'}
			</button>

			<button
				data-testid={`fds-clear-${id}`}
				onClick={() => onSelectedItemsChange([])}
				type='button'
			>
				{'clear'}
			</button>
		</div>
	)
}));

const renderModal = (entityKey = 'accountsAndOpportunities') => {
	const result = render(
		<SalesforceSyncFieldsModal
			entityKey={entityKey}
			onClose={jest.fn()}
			onDone={jest.fn()}
		/>
	);

	act(() => {
		jest.runAllTimers();
	});

	return result;
};

describe('SalesforceSyncFieldsModal', () => {
	beforeAll(() => {
		// @ts-ignore

		ReactDOM.createPortal = jest.fn(element => element);
	});

	afterEach(cleanup);

	it('should render the entity title and a tab for each type', () => {
		renderModal();

		expect(
			screen.getByText('Sync Account and Opportunity Attributes')
		).toBeInTheDocument();
		expect(screen.getByRole('tab', {name: 'Account'})).toBeInTheDocument();
		expect(
			screen.getByRole('tab', {name: 'Opportunities'})
		).toBeInTheDocument();
	});

	it('should show an empty state in the gated tab until its dependency tab has a selection', () => {
		renderModal();

		expect(screen.getByText('No fields available yet')).toBeInTheDocument();
		expect(
			screen.getByText(
				'To select Opportunity fields, first select at least one Account attribute.'
			)
		).toBeInTheDocument();
		expect(
			screen.queryByTestId(
				'fds-select-accountsAndOpportunities-Opportunities-sync-fields'
			)
		).not.toBeInTheDocument();
	});

	it('should reveal the gated data set once its dependency tab has a selection', () => {
		renderModal();

		fireEvent.click(
			screen.getByTestId(
				'fds-select-accountsAndOpportunities-Account-sync-fields'
			)
		);

		expect(
			screen.getByTestId(
				'fds-select-accountsAndOpportunities-Opportunities-sync-fields'
			)
		).toBeInTheDocument();
		expect(
			screen.queryByText('No fields available yet')
		).not.toBeInTheDocument();
	});

	it('should clear the gated selection when its dependency tab is cleared', () => {
		renderModal();

		fireEvent.click(
			screen.getByTestId(
				'fds-select-accountsAndOpportunities-Account-sync-fields'
			)
		);
		fireEvent.click(
			screen.getByTestId(
				'fds-select-accountsAndOpportunities-Opportunities-sync-fields'
			)
		);

		expect(
			screen.getByTestId(
				'fds-count-accountsAndOpportunities-Opportunities-sync-fields'
			)
		).toHaveTextContent('1');

		fireEvent.click(
			screen.getByTestId(
				'fds-clear-accountsAndOpportunities-Account-sync-fields'
			)
		);
		fireEvent.click(
			screen.getByTestId(
				'fds-select-accountsAndOpportunities-Account-sync-fields'
			)
		);

		expect(
			screen.getByTestId(
				'fds-count-accountsAndOpportunities-Opportunities-sync-fields'
			)
		).toHaveTextContent('0');
	});

	it('should render a single-tab entity without a tab bar or gating', () => {
		renderModal('individuals');

		expect(
			screen.getByText('Sync Individual Attributes')
		).toBeInTheDocument();
		expect(
			screen.getByTestId('fds-select-individuals-Contact-sync-fields')
		).toBeInTheDocument();
		expect(screen.queryByRole('tab')).not.toBeInTheDocument();
	});
});

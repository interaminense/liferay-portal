import * as data from 'test/data';
import AssociatedSegmentsCard from '../AssociatedSegmentsCard';
import NoResultsDisplay from 'shared/components/NoResultsDisplay';
import React from 'react';
import {render} from '@testing-library/react';
import {StaticRouter} from 'react-router';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.unmock('react-dom');

const DefaultComponent = props => (
	<StaticRouter>
		<AssociatedSegmentsCard
			dataSourceFn={() =>
				Promise.resolve(data.mockSearch(data.mockSegment, 2))
			}
			groupId='23'
			id='123'
			pageUrl='/foo'
			{...props}
		/>
	</StaticRouter>
);

describe('AssociatedSegmentsCard', () => {
	it('should render', async () => {
		const {container} = render(<DefaultComponent />);

		jest.runAllTimers();

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});

	it('should render w/ loading overlay', () => {
		const {container} = render(
			<DefaultComponent dataSourceFn={() => Promise.resolve({})} />
		);

		expect(container.querySelector('.overlay')).toBeTruthy();
	});

	// SO FUNCIONA QUANDO RODADO ISOLADAMENTE

	it('should render with an error display', async () => {
		const {container, getByText} = render(
			<DefaultComponent dataSourceFn={() => Promise.reject({})} />
		);

		jest.runAllTimers();

		await waitForLoadingToBeRemoved(container);

		expect(getByText('An unexpected error occurred.')).toBeTruthy();
	});

	// SO FUNCIONA QUANDO RODADO ISOLADAMENTE

	it('should render with an no results display', async () => {
		const {container} = render(
			<DefaultComponent
				dataSourceFn={() =>
					Promise.resolve(data.mockSearch(data.mockSegment, 0))
				}
				noResultsRenderer={() => <NoResultsDisplay />}
			/>
		);

		jest.runAllTimers();

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});
});

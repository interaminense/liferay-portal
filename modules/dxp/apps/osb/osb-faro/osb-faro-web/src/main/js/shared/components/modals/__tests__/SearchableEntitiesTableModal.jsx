import React from 'react';
import SearchableEntitiesTableModal from '../SearchableEntitiesTableModal';
import {BrowserRouter} from 'react-router';
import {cleanup, render} from '@testing-library/react';
import {createOrderIOMap, EMAIL_ADDRESS} from 'shared/util/pagination';
import {noop} from 'lodash';
import {OrderByDirections} from 'shared/util/constants';

jest.unmock('react-dom');

const DefaultComponent = props => (
	<BrowserRouter>
		<SearchableEntitiesTableModal
			columns={[
				{
					accessor: 'name',
					className: 'table-cell-expand',
					label: 'name'
				},
				{
					accessor: 'emailAddress',
					label: 'email'
				}
			]}
			dataSourceFn={() => Promise.resolve()}
			groupId='23'
			onClose={noop}
			{...props}
		/>
	</BrowserRouter>
);

describe('SearchableEntitiesTableModal', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<DefaultComponent />);

		expect(container).toMatchSnapshot();
	});

	it('should render w/ defaultParams', () => {
		const {container} = render(
			<DefaultComponent
				initialOrderIOMap={createOrderIOMap(
					EMAIL_ADDRESS,
					OrderByDirections.Descending
				)}
			/>
		);

		const emailHeaderButton = container.querySelectorAll(
			'.table-head-title > button'
		)[1];

		expect(emailHeaderButton).toHaveTextContent('email');
		expect(
			emailHeaderButton.querySelector(
				'.lexicon-icon-order_arrow_descending'
			)
		).toBeTruthy();
	});
});

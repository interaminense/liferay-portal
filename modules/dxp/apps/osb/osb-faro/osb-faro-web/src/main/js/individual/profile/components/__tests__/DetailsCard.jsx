import IndividualDetailsCard from '../DetailsCard';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {fromJS} from 'immutable';
import {Individual} from 'shared/util/records';
import {mockIndividual} from 'test/data';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

describe('IndividualDetailsCard', () => {
	it('should render', () => {
		const {container} = render(
			<BrowserRouter>
				<IndividualDetailsCard
					entity={new Individual(fromJS(mockIndividual()))}
					groupId='23'
				/>
			</BrowserRouter>
		);

		expect(container).toMatchSnapshot();
	});
});

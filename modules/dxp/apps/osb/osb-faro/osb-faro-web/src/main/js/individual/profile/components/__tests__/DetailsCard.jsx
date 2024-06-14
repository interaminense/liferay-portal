import IndividualDetailsCard from '../DetailsCard';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {fromJS} from 'immutable';
import {Individual} from 'shared/util/records';
import {mockIndividual} from 'test/data';
import {StaticRouter} from 'react-router';

jest.unmock('react-dom');

describe('IndividualDetailsCard', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<StaticRouter>
				<IndividualDetailsCard
					entity={new Individual(fromJS(mockIndividual()))}
					groupId='23'
				/>
			</StaticRouter>
		);

		expect(container).toMatchSnapshot();
	});
});

import CompositionCard from '../CompositionCard';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('CompositionCard', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<CompositionCard
				activeIndividualCount={20}
				individualCount={100}
				knownIndividualCount={50}
			/>
		);

		expect(container).toMatchSnapshot();
	});
});

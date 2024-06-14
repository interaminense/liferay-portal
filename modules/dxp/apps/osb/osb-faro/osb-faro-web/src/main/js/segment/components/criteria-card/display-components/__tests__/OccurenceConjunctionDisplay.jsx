import OccurenceConjunctionDisplay from '../OccurenceConjunctionDisplay';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {RelationalOperators} from 'segment/segment-editor/dynamic/utils/constants';

jest.unmock('react-dom');

describe('OccurenceConjunctionDisplay', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<OccurenceConjunctionDisplay
				operatorName={RelationalOperators.GT}
				value={13}
			/>
		);

		expect(container).toMatchSnapshot();
	});
});

import FilterTags from '../FilterTags';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {range} from 'lodash';

jest.unmock('react-dom');

describe('FilterTags', () => {
	afterEach(cleanup);

	it('should render a list of tags', () => {
		const {container} = render(
			<FilterTags
				tags={range(3).map(i => ({
					key: `foo${i}`,
					label: `Foo Label${i}`,
					value: `foo-value${i}`
				}))}
			/>
		);

		expect(container).toMatchSnapshot();
	});
});

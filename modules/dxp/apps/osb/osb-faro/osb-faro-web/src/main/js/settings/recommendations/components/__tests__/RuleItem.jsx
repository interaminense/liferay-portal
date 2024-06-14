import React from 'react';
import RuleItem from '../RuleItem';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('RuleItem', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<RuleItem
				name='includeFilter'
				value='og:url = https://www.liferay.com'
			/>
		);

		expect(container).toMatchSnapshot();
	});
});

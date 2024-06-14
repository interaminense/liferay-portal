import ItemText from '../ItemText';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

const DefaultComponent = props => <ItemText {...props}>{'Content'}</ItemText>;

describe('ItemText', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<DefaultComponent />);

		expect(container).toMatchSnapshot();
	});

	it('should render with subtext', () => {
		const {getByText} = render(<DefaultComponent subtext='subtext here' />);

		expect(getByText('Content')).toHaveClass('list-group-subtext');
	});
});

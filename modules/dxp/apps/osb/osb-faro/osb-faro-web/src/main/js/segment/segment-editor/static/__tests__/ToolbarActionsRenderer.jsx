import React from 'react';
import ToolbarActionsRenderer from '../ToolbarActionsRenderer';
import {cleanup, render} from '@testing-library/react';
import {OrderedMap} from 'immutable';

jest.unmock('react-dom');

describe('ToolbarActionsRenderer', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<ToolbarActionsRenderer />);

		expect(container).toMatchSnapshot();
	});

	it('should render secondary button actions if items are selected', () => {
		const {container} = render(
			<ToolbarActionsRenderer
				selectedItemsIOMap={
					new OrderedMap([
						[1, {}],
						[2, {}]
					])
				}
			/>
		);

		expect(container.querySelectorAll('button')).toHaveLength(2);
	});

	it('should not render remove button when showAdded is true', () => {
		const {container} = render(
			<ToolbarActionsRenderer
				selectedItemsIOMap={
					new OrderedMap([
						[1, {}],
						[2, {}]
					])
				}
				showAdded
			/>
		);

		expect(container.querySelectorAll('button')).toHaveLength(1);
		expect(container.querySelector('button')).toHaveTextContent(
			'Undo Changes'
		);
	});
});

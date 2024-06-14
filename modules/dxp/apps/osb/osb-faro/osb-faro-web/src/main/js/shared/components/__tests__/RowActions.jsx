import getCN from 'classnames';
import React from 'react';
import RowActions from '../RowActions';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

const WrappedComponent = props => (
	<td className={getCN(props.className)}>
		<RowActions {...props} />
	</td>
);

describe('RowActions', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<WrappedComponent actions={[{label: 'foo'}]} />
		);

		expect(container).toMatchSnapshot();
	});

	it('should render with quick actions', () => {
		const {container} = render(
			<WrappedComponent
				actions={[{label: 'foo'}]}
				quickActions={[{iconSymbol: 'pencil', label: 'foo'}]}
			/>
		);

		expect(container.querySelector('.quick-action-menu')).toBeTruthy();
	});
});

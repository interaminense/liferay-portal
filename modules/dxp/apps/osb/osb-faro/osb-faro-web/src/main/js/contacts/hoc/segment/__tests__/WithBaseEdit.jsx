jest.unmock('shared/components/DocumentTitle');

import * as data from 'test/data';
import React from 'react';
import withBaseEdit from '../WithBaseEdit';
import {AppContext} from 'AppContext';
import {compose} from 'redux';
import {mockChannel} from './data';
import {renderWithStore} from 'test/mock-store';
import {withStaticRouter} from 'test/mock-router';

jest.unmock('react-dom');

class TestComponent extends React.Component {
	render() {
		return <div>{'foobar'}</div>;
	}
}

describe('WithBaseEdit', () => {
	it('should render the wrapped component', () => {
		const WrappedComponent = compose(
			props => Component => (
				<AppContext.Provider
					value={{
						channels: [mockChannel(1), mockChannel(2)],
						selectedChannel: mockChannel(),
						setSelectedChannel: jest.fn(() => null)
					}}
				>
					<Component {...props} />
				</AppContext.Provider>
			),
			withStaticRouter,
			withBaseEdit
		)(TestComponent);

		const {container} = renderWithStore(WrappedComponent, {
			groupId: '23',
			id: '123',
			segment: data.mockSegment()
		});

		expect(container).toMatchSnapshot();
	});
});

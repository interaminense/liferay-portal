import Events from '../EventAttributes';
import mockStore from 'test/mock-store';
import React from 'react';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';
import {Routes} from 'shared/util/router';
import {withDataRouter} from 'test/mock-router';

jest.unmock('react-dom');

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		groupId: '23'
	})
}));

describe('EventAttributes', () => {
	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				{withDataRouter(<Events groupId='23' />, {
					initialEntries: [
						'/workspace/23/settings/definitions/event-attributes/local'
					],
					path: Routes.SETTINGS_DEFINITIONS_EVENT_ATTRIBUTES_LOCAL
				})}
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});

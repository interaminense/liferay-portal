import Events from '../Events';
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

describe('Events', () => {
	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				{withDataRouter(<Events groupId='23' />, {
					initialEntries: [
						'/workspace/23/settings/definitions/events/default'
					],
					path: Routes.SETTINGS_DEFINITIONS_EVENTS_DEFAULT
				})}
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});

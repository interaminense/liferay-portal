import mockStore from 'test/mock-store';
import React from 'react';
import TabsCard from '../TabsCard';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';
import {Routes} from 'shared/util/router';
import {withDataRouter} from 'test/mock-router';

jest.unmock('react-dom');

describe('TabsCard', () => {
	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				{withDataRouter(<TabsCard groupId='23' />, {
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

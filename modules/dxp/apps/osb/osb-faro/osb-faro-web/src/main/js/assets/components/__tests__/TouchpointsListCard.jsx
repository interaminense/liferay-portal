import BasePage from 'shared/components/base-page';
import client from 'shared/apollo/client';
import React from 'react';
import TouchpointsListCard from '../TouchpointsListCard';
import {ApolloProvider} from '@apollo/react-components';
import {BrowserRouter} from 'react-router-dom';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

const MOCK_ITEMS = [
	{
		title: 'Digital Experience Platform 1',
		touchpoint: 'https://www.liferay.com/digital-experience-platform-1'
	},
	{
		title: 'Digital Experience Platform 2',
		touchpoint: 'https://www.liferay.com/digital-experience-platform-2'
	},
	{
		title: 'Digital Experience Platform 3',
		touchpoint: 'https://www.liferay.com/digital-experience-platform-3'
	}
];

const MOCK_CONTEXT = {
	router: {
		params: {
			channelId: '456',
			groupId: '2000'
		},
		query: {
			rangeKey: '30'
		}
	}
};

const WrappedComponent = props => (
	<ApolloProvider client={client}>
		<BasePage.Context.Provider value={MOCK_CONTEXT}>
			<BrowserRouter>
				<TouchpointsListCard {...props} />
			</BrowserRouter>
		</BasePage.Context.Provider>
	</ApolloProvider>
);

describe('TouchpointsListCard', () => {
	it('should render', () => {
		const {container} = render(<WrappedComponent />);

		expect(container).toMatchSnapshot();
	});

	it('should render with items', () => {
		const {getByText} = render(<WrappedComponent items={MOCK_ITEMS} />);

		MOCK_ITEMS.forEach(({title}) => {
			expect(getByText(title)).toBeTruthy();
		});
	});
});

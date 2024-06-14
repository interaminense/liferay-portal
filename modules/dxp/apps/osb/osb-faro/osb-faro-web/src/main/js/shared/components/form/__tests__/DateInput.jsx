import client from 'shared/apollo/client';
import DateInput from '../DateInput';
import React from 'react';
import {ApolloProvider} from '@apollo/react-hooks';
import {cleanup, render} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {mockForm} from 'test/data';
import {mockPreferenceReq} from 'test/graphql-data';

jest.unmock('react-dom');

const DefaultComponent = props => (
	<ApolloProvider client={client}>
		<MockedProvider mocks={[mockPreferenceReq()]}>
			<DateInput field={{name: 'foo'}} form={mockForm()} {...props} />
		</MockedProvider>
	</ApolloProvider>
);

describe('DateInput', () => {
	afterEach(cleanup);

	const labelContent = 'Foo Date';

	it('should render', () => {
		const {container} = render(<DefaultComponent />);

		expect(container).toMatchSnapshot();
	});

	it('should render with label', () => {
		const {queryByText} = render(<DefaultComponent label={labelContent} />);

		expect(queryByText(labelContent)).toBeTruthy();
	});

	it('should render as required', () => {
		const {queryByText} = render(
			<DefaultComponent label={labelContent} required />
		);

		expect(queryByText(labelContent).closest('label')).toHaveClass(
			'required'
		);
	});
});

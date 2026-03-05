import * as data from 'test/data';
import AddWorkspaceForm from '../AddWorkspaceForm';
import mockStore from 'test/mock-store';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {Project} from 'shared/util/records';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

const DefaultComponent = props => (
	<Provider store={mockStore()}>
		<BrowserRouter>
			<AddWorkspaceForm {...props} />
		</BrowserRouter>
	</Provider>
);

describe('AddWorkspaceForm', () => {
	it('should render', () => {
		const {container} = render(<DefaultComponent />);
		expect(container).toMatchSnapshot();
	});

	it('should render the edit version', () => {
		const {container, getByTestId, queryByText} = render(
			<DefaultComponent
				editing
				project={data.getImmutableMock(Project, data.mockProject)}
			/>
		);

		expect(
			queryByText('You can only set your friendly workspace url once')
		).toBeNull();

		expect(container.querySelector('.select-root')).toBeDisabled();
		expect(queryByText('Save')).not.toBeNull();
		expect(getByTestId('server-location-input')).toBeDisabled();
	});

	it('should disable friendlyURL input if friendlyURL exists on Project', () => {
		const {getByTestId} = render(
			<DefaultComponent
				project={data.getImmutableMock(Project, data.mockProject, 1, {
					friendlyURL: 'foo'
				})}
			/>
		);

		expect(getByTestId('friendly-url-input')).toBeDisabled();
	});
});

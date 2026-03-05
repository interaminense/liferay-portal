import * as API from 'shared/api';
import * as data from 'test/data';
import React from 'react';
import WorkspaceListItem from '../ListItem';
import {BrowserRouter} from 'react-router';
import {cleanup, fireEvent, render} from '@testing-library/react';
import {ProjectStates} from 'shared/util/constants';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.unmock('react-dom');

describe('WorkspaceListItem', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<BrowserRouter>
				<WorkspaceListItem
					accountName=''
					projectState={ProjectStates.Ready}
				/>
			</BrowserRouter>
		);

		expect(container).toMatchSnapshot();
	});

	it('should render a workspace item as enabled if is unavailable and the user clicks the item to reload and it then changes to available', async () => {
		API.projects.fetch.mockImplementationOnce(() =>
			Promise.resolve(data.mockProject('23'))
		);

		const {container, queryByText} = render(
			<BrowserRouter>
				<WorkspaceListItem projectState={ProjectStates.Unavailable} />
			</BrowserRouter>
		);

		const button = queryByText('Workspace unavailable; click to reload.');

		expect(button).toBeTruthy();

		fireEvent.click(button);

		jest.runAllTimers();

		await waitForLoadingToBeRemoved(container);

		expect(
			queryByText('Workspace unavailable; click to reload.')
		).toBeNull();
	});

	it('should render a workspace with projects you can join', () => {
		const {queryByText} = render(
			<BrowserRouter>
				<WorkspaceListItem
					isJoinableProjects
					projectState={ProjectStates.Ready}
				/>
			</BrowserRouter>
		);

		expect(queryByText('Request Access')).toBeTruthy();
	});

	it('should render a workspace with a deactivated project', () => {
		const {queryByText} = render(
			<BrowserRouter>
				<WorkspaceListItem projectState={ProjectStates.Deactivated} />
			</BrowserRouter>
		);
		expect(queryByText('Activate')).toBeTruthy();
	});
});

import mockStore from 'test/mock-store';
import React from 'react';
import WorkspacesMenu from '../index';
import {fireEvent, render, screen} from '@testing-library/react';
import {fromJS} from 'immutable';
import {mockProject} from 'test/data';
import {Project} from 'shared/util/records';
import {Provider} from 'react-redux';

jest.unmock('react-dom');

jest.mock('shared/hooks/useProjects', () => ({
	useFetchProjects: jest.fn(),
}));

const {useFetchProjects} = jest.requireMock('shared/hooks/useProjects');

const toProject = (seed: number, data = {}) =>
	new Project(fromJS(mockProject(seed, data)));

const renderMenu = (groupId = '23') =>
	render(
		<Provider store={mockStore()}>
			<WorkspacesMenu groupId={groupId} />
		</Provider>
	);

describe('WorkspacesMenu', () => {
	const assign = jest.fn();

	beforeAll(() => {
		Object.defineProperty(window, 'location', {
			value: {...window.location, assign},
			writable: true,
		});
	});

	beforeEach(() => {
		useFetchProjects.mockReturnValue({
			data: [
				toProject(23, {name: 'Acme'}),
				toProject(42, {friendlyURL: '/globex', name: 'Globex'}),
				toProject(51, {name: 'Initech', state: 'UNCONFIGURED'}),
			],
			loading: false,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('labels the trigger with the current workspace', () => {
		renderMenu();

		expect(
			screen.getByRole('combobox', {name: 'Workspace'})
		).toHaveTextContent('Acme');
	});

	it('matches the current workspace by its friendly URL', () => {
		renderMenu('globex');

		expect(
			screen.getByRole('combobox', {name: 'Workspace'})
		).toHaveTextContent('Globex');
	});

	it('lists the configured workspaces and a link to all of them', async () => {
		renderMenu();

		fireEvent.click(screen.getByRole('combobox', {name: 'Workspace'}));

		expect(
			await screen.findByRole('option', {name: 'Globex'})
		).toBeTruthy();
		expect(
			screen.getByRole('option', {name: 'View All Workspaces'})
		).toBeTruthy();
		expect(screen.queryByRole('option', {name: 'Initech'})).toBeNull();
	});

	it('navigates to the picked workspace', async () => {
		renderMenu();

		fireEvent.click(screen.getByRole('combobox', {name: 'Workspace'}));

		fireEvent.click(await screen.findByRole('option', {name: 'Globex'}));

		expect(assign).toHaveBeenCalledWith('/workspace/globex');
	});

	it('navigates to the workspace list from the last option', async () => {
		renderMenu();

		fireEvent.click(screen.getByRole('combobox', {name: 'Workspace'}));

		fireEvent.click(
			await screen.findByRole('option', {name: 'View All Workspaces'})
		);

		expect(assign).toHaveBeenCalledWith('/');
	});

	it('does not navigate when the current workspace is picked', async () => {
		renderMenu();

		fireEvent.click(screen.getByRole('combobox', {name: 'Workspace'}));

		fireEvent.click(await screen.findByRole('option', {name: 'Acme'}));

		expect(assign).not.toHaveBeenCalled();
	});
});

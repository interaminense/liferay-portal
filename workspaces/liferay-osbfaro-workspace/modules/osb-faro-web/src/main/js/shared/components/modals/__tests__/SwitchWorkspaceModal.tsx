import React from 'react';
import SwitchWorkspaceModal from '../SwitchWorkspaceModal';
import {fireEvent, render, screen} from '@testing-library/react';
import {fromJS} from 'immutable';
import {mockProject} from 'test/data';
import {Project} from 'shared/util/records';

jest.unmock('react-dom');

jest.mock('shared/hooks/useProjects', () => ({
	useFetchProjects: jest.fn(),
}));

const {useFetchProjects} = jest.requireMock('shared/hooks/useProjects');

const toProject = (seed: number, data = {}) =>
	new Project(fromJS(mockProject(seed, data)));

const renderModal = (groupId = '23', onClose = jest.fn()) =>
	render(<SwitchWorkspaceModal groupId={groupId} onClose={onClose} />);

describe('SwitchWorkspaceModal', () => {
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

	it('lists the configured workspaces', () => {
		renderModal();

		expect(screen.getByText('Acme')).toBeTruthy();
		expect(screen.getByText('Globex')).toBeTruthy();
		expect(screen.queryByText('Initech')).toBeNull();
	});

	it('marks the current workspace and does not link it', () => {
		renderModal();

		expect(screen.getByText('Current')).toBeTruthy();
		expect(screen.getByText('Acme').closest('a')).toBeNull();
	});

	it('matches the current workspace by its friendly URL', () => {
		renderModal('globex');

		expect(screen.getByText('Globex').closest('a')).toBeNull();
	});

	it('links every other workspace to its page', () => {
		renderModal();

		expect(screen.getByText('Globex').closest('a')).toHaveAttribute(
			'href',
			'/workspace/globex'
		);
	});

	it('filters the workspaces by name', () => {
		renderModal();

		fireEvent.change(screen.getByLabelText('Search'), {
			target: {value: 'glo'},
		});

		expect(screen.getByText('Globex')).toBeTruthy();
		expect(screen.queryByText('Acme')).toBeNull();
	});

	it('links to all workspaces from the footer', () => {
		renderModal();

		expect(
			screen.getByText('View All Workspaces').closest('a')
		).toHaveAttribute('href', '/');
	});

	it('closes from the header', () => {
		const onClose = jest.fn();

		const {container} = renderModal('23', onClose);

		fireEvent.click(container.querySelector('.modal-header button')!);

		expect(onClose).toHaveBeenCalled();
	});
});

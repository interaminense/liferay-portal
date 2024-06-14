import {cleanup} from '@testing-library/react';
import {
	configureProject,
	createProject,
	createTrialProject,
	fetchProject,
	fetchProjects,
	fetchProjectViaCorpProjectUuid,
	updateProject
} from '../projects';
import {isFSA} from 'flux-standard-action';

describe('Projects Actions', () => {
	afterEach(cleanup);

	describe('createProject', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = createProject();

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('configureProject', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = configureProject({
				emailAddressDomains: [],
				friendlyURL: 'ggwp',
				groupId: '123',
				name: 'Configure'
			});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('createTrialProject', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = createTrialProject();

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('fetchProject', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = fetchProject({groupId: '23'});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('fetchProjects', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = fetchProjects();

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('fetchProjectViaCorpProjectUuid', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = fetchProjectViaCorpProjectUuid({
				corpProjectUuid: '23-44'
			});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('updateProject', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = updateProject({
				emailAddressDomains: [],
				friendlyURL: 'bananas',
				groupId: '23',
				name: 'Test Test'
			});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});
});

import {cleanup} from '@testing-library/react';
import {
	createLiferayDataSource,
	createSalesforceDataSource,
	deleteDataSource,
	fetchDataSource,
	updateCSVDataSource,
	updateLiferayDataSource,
	updateSalesforceDataSource
} from '../data-sources';
import {isFSA} from 'flux-standard-action';

describe('DataSources', () => {
	afterEach(cleanup);

	describe('createLiferayDataSource', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = createLiferayDataSource({});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('createSalesforceDataSource', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = createSalesforceDataSource({});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('deleteDataSource', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = deleteDataSource({});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('fetchDataSource', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = fetchDataSource({});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('updateCSVDataSource', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = updateCSVDataSource({});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('updateLiferayDataSource', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = updateLiferayDataSource({});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('updateSalesforceDataSource', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = updateSalesforceDataSource({});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});
});

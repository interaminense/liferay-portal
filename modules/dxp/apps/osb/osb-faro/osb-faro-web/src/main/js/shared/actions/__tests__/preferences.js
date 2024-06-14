import * as actions from '../preferences';
import {cleanup} from '@testing-library/react';
import {isFSA} from 'flux-standard-action';

describe('Preferences Actions', () => {
	afterEach(cleanup);

	describe('addDistributionTabs', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = actions.addDistributionTab({
				distributionKey: '123',
				distributionTab: {},
				distributionTabId: 'Test Tab',
				groupId: '321',
				id: '123'
			});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('fetchDistributionTabs', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = actions.fetchDistributionTabs({
				distributionKey: '321',
				groupId: '123',
				id: '321'
			});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('removeDistributionTabs', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = actions.removeDistributionTab({
				distributionKey: '123',
				distributionTabId: 'Test Tab',
				groupId: '321',
				id: '123'
			});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('fetchDefaultChannelId', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = actions.fetchDefaultChannelId('321');

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('fetchUpgradeModalSeen', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = actions.fetchUpgradeModalSeen();

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('updateDefaultChannelId', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = actions.updateDefaultChannelId({
				defaultChannelId: '122',
				groupId: '321'
			});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('updateUpgradeModalSeen', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = actions.updateUpgradeModalSeen({
				groupId: '321',
				upgradeModalSeen: true
			});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});
});

import '@testing-library/jest-dom';
import 'jest-extended';
import * as pedantic from './pedantic';
import lang from './lang';
import {TextDecoder, TextEncoder} from 'util';

pedantic.enable();

jest.mock('shared/util/svg');
jest.mock('shared/api');
jest.mock('shared/components/DocumentTitle');
jest.mock('react-dom');

document.body.className = 'dxp';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
	disconnect: jest.fn(),
	observe: jest.fn(),
	unobserve: jest.fn()
}));

global.analytics = {
	group: () => {},
	identify: () => {},
	track: () => {}
};

global.AUI = () => ({
	use: (module, callback) => callback()
});

global.Liferay = {
	FeatureFlags: {},
	Language: {
		get: lang
	}
};

global.console = {error: jest.fn(), log: console.log, warn: jest.fn()}; // eslint-disable-line no-console

global.localStorage = (() => {
	let store = {};

	return {
		/**
		 * Clear
		 */
		clear() {
			store = {};
		},

		/**
		 * Get Item
		 * @param {string} key
		 */
		getItem(key) {
			return store[key];
		},

		/**
		 * Remove Item
		 * @param {string} key
		 */
		removeItem(key) {
			delete store[key];
		},

		/**
		 * Set Item
		 * @param {string} key
		 * @param {string} value
		 */
		setItem(key, value) {
			store[key] = value.toString();
		}
	};
})();

global.pendo = {
	initialize: () => {}
};

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

/**
 * Force a consistent locale in tests to override
 * Number.prototype.toLocaleString and Intl.NumberFormat,
 * forcing them to default to en-US if no locale is provided.
 */

const OriginalToLocaleString = Number.prototype.toLocaleString;

Number.prototype.toLocaleString = function (locales, options) {
	return OriginalToLocaleString.call(this, locales || 'en-US', options);
};

const OriginalNumberFormat = Intl.NumberFormat;

Intl.NumberFormat = function (locales, options) {
	return new OriginalNumberFormat(locales || 'en-US', options);
};

Intl.NumberFormat.prototype = OriginalNumberFormat.prototype;
Intl.NumberFormat.supportedLocalesOf = OriginalNumberFormat.supportedLocalesOf;

require('jest-extended');
require('jest-canvas-mock');

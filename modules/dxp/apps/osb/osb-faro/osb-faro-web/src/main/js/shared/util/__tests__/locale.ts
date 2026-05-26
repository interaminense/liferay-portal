import {getFlagSymbol} from 'shared/util/locale';

describe('getFlagSymbol', () => {
	it('returns undefined for an empty string', () => {
		expect(getFlagSymbol('')).toBeUndefined();
	});

	it('builds a Clay flag symbol for an xx_YY locale', () => {
		expect(getFlagSymbol('en_US')).toBe('flags-en-US');
	});

	it('builds a Clay flag symbol for pt_BR', () => {
		expect(getFlagSymbol('pt_BR')).toBe('flags-pt-BR');
	});

	it('preserves all segments for multi-segment locales', () => {
		expect(getFlagSymbol('sr_RS_latin')).toBe('flags-sr-RS-latin');
	});

	it('falls back to the canonical country for a 2-letter locale', () => {
		expect(getFlagSymbol('de')).toBe('flags-de-DE');
	});

	it('returns undefined for an unknown 2-letter locale', () => {
		expect(getFlagSymbol('xx')).toBeUndefined();
	});
});

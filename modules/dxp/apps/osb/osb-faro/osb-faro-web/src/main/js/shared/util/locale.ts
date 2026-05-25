/**
 * Canonical Clay flag symbol for two-letter Liferay locale ids that lack a
 * country segment (e.g. `de`, `fr`). Clay ships flag SVGs only as
 * `flags-<lang>-<COUNTRY>.svg`, never `flags-<lang>.svg`, so we resolve a
 * default country variant for each language we ship.
 */
const LANGUAGE_TO_FLAG_SYMBOL: Record<string, string> = {
	ar: 'flags-ar-SA',
	bg: 'flags-bg-BG',
	ca: 'flags-ca-ES',
	cs: 'flags-cs-CZ',
	da: 'flags-da-DK',
	de: 'flags-de-DE',
	el: 'flags-el-GR',
	en: 'flags-en-US',
	es: 'flags-es-ES',
	et: 'flags-et-EE',
	eu: 'flags-eu-ES',
	fa: 'flags-fa-IR',
	fi: 'flags-fi-FI',
	fr: 'flags-fr-FR',
	gl: 'flags-gl-ES',
	he: 'flags-he-IL',
	hi: 'flags-hi-IN',
	hr: 'flags-hr-HR',
	hu: 'flags-hu-HU',
	id: 'flags-id-ID',
	it: 'flags-it-IT',
	ja: 'flags-ja-JP',
	ko: 'flags-ko-KR',
	lt: 'flags-lt-LT',
	lv: 'flags-lv-LV',
	nb: 'flags-nb-NO',
	nl: 'flags-nl-NL',
	pl: 'flags-pl-PL',
	pt: 'flags-pt-PT',
	ro: 'flags-ro-RO',
	ru: 'flags-ru-RU',
	sk: 'flags-sk-SK',
	sl: 'flags-sl-SI',
	sr: 'flags-sr-RS',
	sv: 'flags-sv-SE',
	th: 'flags-th-TH',
	tr: 'flags-tr-TR',
	uk: 'flags-uk-UA',
	vi: 'flags-vi-VN',
	zh: 'flags-zh-CN'
};

/**
 * Resolves the Clay SVG symbol id (e.g. `flags-en-US`) for a Liferay locale
 * id. Locale ids with a country segment map directly (`en_US` →
 * `flags-en-US`); bare two-letter ids fall back to a canonical country.
 * Returns `undefined` when no mapping is available.
 */
export function getFlagSymbol(languageId: string): string | undefined {
	if (!languageId) {
		return undefined;
	}

	if (languageId.includes('_')) {
		return `flags-${languageId.replace(/_/g, '-')}`;
	}

	return LANGUAGE_TO_FLAG_SYMBOL[languageId.toLowerCase()];
}

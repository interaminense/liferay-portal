/**
 * Locale-aware fork of liferay-lang-key-dev-loader. Reads every
 * Language_<locale>.properties next to the configured base file, emits a
 * per-key map of locale → value into the module, and rewrites
 * `Liferay.Language.get('key')` calls to a small runtime that picks the
 * value for the active language id (from Liferay.ThemeDisplay or the
 * document <html lang> attribute), falling back to English.
 *
 * Behaviour difference from the original: the upstream loader inlines only
 * the English value, so the dev bundle is hardcoded to English regardless
 * of the user's selected language. This fork preserves the same compile-
 * time speed (no runtime API calls) while honouring the active locale.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const CALL_REGEX = /Liferay\s*\.Language\s*\.get\(\s*'(.*?)'\s*\)/g;

const _propsCache = new Map();

function parseProperties(text) {
	const map = Object.create(null);

	for (const raw of text.split('\n')) {
		if (!raw || raw.startsWith('#')) {
			continue;
		}

		const idx = raw.indexOf('=');

		if (idx < 0) {
			continue;
		}

		map[raw.slice(0, idx)] = raw.slice(idx + 1);
	}

	return map;
}

function loadProperties(file) {
	const stat = fs.statSync(file);
	const cached = _propsCache.get(file);

	if (cached && cached.mtime === stat.mtimeMs) {
		return cached.map;
	}

	const map = parseProperties(fs.readFileSync(file, 'utf8'));

	_propsCache.set(file, {map, mtime: stat.mtimeMs});

	return map;
}

function stripAutoCopySuffix(value) {
	return value.replace(/\s*\(Automatic Copy\)\s*$/, '');
}

module.exports = function (source) {
	const options =
		(typeof this.getOptions === 'function' ? this.getOptions() : {}) || {};

	const basePath = options.path
		? path.isAbsolute(options.path)
			? options.path
			: path.resolve(this.rootContext || process.cwd(), options.path)
		: path.resolve(
				this.rootContext || process.cwd(),
				'src',
				'main',
				'resources',
				'content',
				'Language.properties'
		  );

	this.addDependency(basePath);

	const dir = path.dirname(basePath);
	const enMap = loadProperties(basePath);

	const referencedKeys = new Set();
	const scanRegex = new RegExp(CALL_REGEX.source, CALL_REGEX.flags);
	let match;

	while ((match = scanRegex.exec(source)) !== null) {
		referencedKeys.add(match[1]);
	}

	if (referencedKeys.size === 0) {
		return source;
	}

	const localeFiles = fs
		.readdirSync(dir)
		.filter(f => /^Language_[A-Za-z_]+\.properties$/.test(f));

	const localeMaps = Object.create(null);

	for (const file of localeFiles) {
		const m = file.match(/^Language_([A-Za-z_]+)\.properties$/);
		const locale = m[1];
		const fullPath = path.join(dir, file);

		this.addDependency(fullPath);
		localeMaps[locale] = loadProperties(fullPath);
	}

	const perKey = Object.create(null);

	for (const key of referencedKeys) {
		const enValue = enMap[key] || key;
		const entry = {_: enValue};

		for (const locale of Object.keys(localeMaps)) {
			const raw = localeMaps[locale][key];

			if (raw == null || raw === '') {
				continue;
			}

			const cleaned = stripAutoCopySuffix(raw);

			if (cleaned && cleaned !== enValue) {
				entry[locale] = cleaned;
			}
		}

		perKey[key] = entry;
	}

	const helperVar = `__lifLang${Math.floor(Math.random() * 1e9).toString(
		36
	)}`;

	const helper =
		`var ${helperVar}=(function(){var m=${JSON.stringify(
			perKey
		)};return function(k){var e=m[k];if(!e)return k;var L=` +
		'(typeof Liferay!=="undefined"&&Liferay.ThemeDisplay&&Liferay.ThemeDisplay.getLanguageId&&Liferay.ThemeDisplay.getLanguageId())' +
		'||(typeof document!=="undefined"&&document.documentElement&&document.documentElement.lang)||"";' +
		'L=String(L).replace("-","_");' +
		'if(e[L])return e[L];' +
		'var b=L.split("_")[0];' +
		'for(var k2 in e){if(k2!=="_"&&k2.split("_")[0]===b)return e[k2];}' +
		'return e._;};})();';

	const transformed = source.replace(
		CALL_REGEX,
		(_, key) => `${helperVar}(${JSON.stringify(key)})`
	);

	return `${helper}\n${transformed}`;
};

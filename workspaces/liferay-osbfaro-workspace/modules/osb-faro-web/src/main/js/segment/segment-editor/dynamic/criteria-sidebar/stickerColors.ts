import React from 'react';

/**
 * Clay tokens for the background and icon of each condition type sticker.
 */
const STICKER_COLORS: Record<string, [string, string]> = {
	account: ['orange-l5', 'orange'],
	disabled: ['secondary-l3', 'secondary'],
	event: ['teal-l5', 'teal'],
	individual: ['indigo-l5', 'indigo'],
	interest: ['red-l5', 'red'],
	organization: ['cyan-l5', 'cyan'],
	'search-term': ['pink-l5', 'pink'],
	session: ['purple-l5', 'purple'],
	tag: ['yellow-l5', 'yellow-d4'],
	vocabulary: ['blue-l5', 'blue'],
	web: ['teal-l5', 'teal'],
};

const DEFAULT_STICKER_COLORS: [string, string] = ['indigo-l5', 'indigo'];

export const getStickerStyle = (propertyKey?: string): React.CSSProperties => {
	const [background, color] =
		(propertyKey && STICKER_COLORS[propertyKey]) || DEFAULT_STICKER_COLORS;

	return {
		backgroundColor: `var(--cadmin-${background})`,
		color: `var(--cadmin-${color})`,
	};
};

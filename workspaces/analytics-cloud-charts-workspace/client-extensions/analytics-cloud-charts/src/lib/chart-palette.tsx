/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {createContext, ReactNode, useContext, useMemo} from 'react';

import {CHART_PALETTE} from './charts';

const ChartPaletteContext = createContext<string[]>(CHART_PALETTE);

export interface ChartPaletteProviderProps {
	children: ReactNode;
	colors?: string[];
}

export const ChartPaletteProvider: React.FC<ChartPaletteProviderProps> = ({
	children,
	colors,
}) => {
	const palette = useMemo(() => {
		if (!colors?.length) {
			return CHART_PALETTE;
		}

		return CHART_PALETTE.map((fallback, index) => {
			const candidate = colors[index];

			return candidate && /^#[0-9a-fA-F]{6}$/.test(candidate)
				? candidate
				: fallback;
		});
	}, [colors]);

	return (
		<ChartPaletteContext.Provider value={palette}>
			{children}
		</ChartPaletteContext.Provider>
	);
};

export const useChartPalette = () => useContext(ChartPaletteContext);

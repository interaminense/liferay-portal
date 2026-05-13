/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import React from 'react';

import {SUPPORTED_CONJUNCTION_OPTIONS} from '../utils/constants';

interface IConjunctionProps {
	conjunctionName: string;
	onChange: (next: string) => void;
}

export const Conjunction = ({conjunctionName, onChange}: IConjunctionProps) => {
	const current = SUPPORTED_CONJUNCTION_OPTIONS.find(
		({name}) => name === conjunctionName
	);

	const handleClick = () => {
		const index = SUPPORTED_CONJUNCTION_OPTIONS.findIndex(
			({name}) => name === conjunctionName
		);

		const nextIndex = (index + 1) % SUPPORTED_CONJUNCTION_OPTIONS.length;

		onChange(SUPPORTED_CONJUNCTION_OPTIONS[nextIndex].name);
	};

	return (
		<div className="conjunction-container">
			<ClayButton
				className="conjunction-button"
				displayType="secondary"
				onClick={handleClick}
				size="sm"
			>
				{current ? current.label : conjunctionName}
			</ClayButton>

			<div className="conjunction-separator" />
		</div>
	);
};

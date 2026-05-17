/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import getCN from 'classnames';
import React from 'react';

import {SUPPORTED_CONJUNCTION_OPTIONS} from '../utils/constants';

interface IConjunctionProps extends React.HTMLAttributes<HTMLButtonElement> {
	conjunctionName: string;
}

class Conjunction extends React.Component<IConjunctionProps> {
	getConjunctionLabel(conjunctionName: string) {
		const conjunction = SUPPORTED_CONJUNCTION_OPTIONS.find(
			({name}) => name === conjunctionName
		);

		return conjunction ? conjunction.label : undefined;
	}

	render() {
		const {className, conjunctionName, onClick} = this.props;

		const classnames = getCN(
			'ac-segment-builder-web__conjunction-button',
			'ac-segment-builder-web__conjunction-label',
			'button-root',
			className
		);

		return (
			<div className="ac-segment-builder-web__conjunction-container">
				<ClayButton
					className={classnames}
					displayType="secondary"
					onClick={onClick}
					size="sm"
				>
					{this.getConjunctionLabel(conjunctionName)}
				</ClayButton>

				<div className="ac-segment-builder-web__separator" />
			</div>
		);
	}
}

export default Conjunction;

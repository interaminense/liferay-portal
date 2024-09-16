/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import classNames from 'classnames';
import React from 'react';

import {Alignments, Weights} from '../types/global';

const CLASSNAME = 'analytics-tooltip-chart';

const Body: React.FC<React.HTMLAttributes<HTMLElement>> = ({
	children,
	className,
}) => (
	<tbody className={classNames(`${CLASSNAME}-body`, className)}>
		{children}
	</tbody>
);

interface IColumnProps extends React.HTMLAttributes<HTMLTableCellElement> {
	align?: Alignments;
	colSpan?: number;
	truncated?: boolean;
	weight?: Weights;
}

const Column: React.FC<IColumnProps> = ({
	align = Alignments.Left,
	children,
	className,
	truncated = false,
	weight = Weights.Normal,
	...otherProps
}) => (
	<td {...otherProps}>
		<div
			className={classNames(
				`${CLASSNAME}-content`,
				`${CLASSNAME}-column`,
				className,
				{
					[`text-${align}`]: align,
					[`font-weight-${weight}`]: weight,
				}
			)}
		>
			{truncated ? (
				<div className={`${CLASSNAME}-truncated`}>{children}</div>
			) : (
				children
			)}
		</div>
	</td>
);

const Header: React.FC<React.HTMLAttributes<HTMLElement>> = ({
	children,
	className,
}) => (
	<thead className={classNames(`${CLASSNAME}-header`, className)}>
		{children}
	</thead>
);

const Row: React.FC<React.HTMLAttributes<HTMLElement>> = ({
	children,
	className,
}) => <tr className={classNames(`${CLASSNAME}-row`, className)}>{children}</tr>;

const TooltipTemplate: React.FC<React.HTMLAttributes<HTMLElement>> = ({
	children,
	className,
}) => <table className={classNames(CLASSNAME, className)}>{children}</table>;

export default Object.assign(TooltipTemplate, {
	Body,
	Column,
	Header,
	Row,
});

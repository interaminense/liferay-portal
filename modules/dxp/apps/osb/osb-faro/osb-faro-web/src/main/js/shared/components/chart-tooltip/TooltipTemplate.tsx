import React from 'react';
import {Alignments} from './types';
import {Text} from '@clayui/core';
import {WeightFont} from '@clayui/core/lib/typography/Text';

const Body = ({children}) => (
	<tbody className='analytics-tooltip-chart__body'>{children}</tbody>
);

interface IColumnProps extends React.HTMLAttributes<HTMLTableCellElement> {
	align?: Alignments;
	weight?: WeightFont;
}

const Column: React.FC<IColumnProps> = ({
	align = Alignments.Left,
	children,
	weight = 'normal'
}) => (
	<td className='analytics-tooltip-chart__column'>
		<div className={`text-${align}`}>
			<Text size={2} weight={weight}>
				{children}
			</Text>
		</div>
	</td>
);

const HeaderColumn: React.FC<IColumnProps> = ({
	align = Alignments.Left,
	children,
	weight = 'semi-bold'
}) => (
	<th className='analytics-tooltip-chart__column'>
		<div className={`text-${align}`}>
			<Text size={3} weight={weight}>
				{children}
			</Text>
		</div>
	</th>
);

const Header = ({children}) => (
	<thead className='analytics-tooltip-chart__header'>{children}</thead>
);

const Row = ({children}) => <tr>{children}</tr>;

export const TooltipTemplate = ({children}) => (
	<div className='analytics-tooltip-chart'>
		<table>{children}</table>
	</div>
);

TooltipTemplate.Body = Body;
TooltipTemplate.HeaderColumn = HeaderColumn;
TooltipTemplate.Column = Column;
TooltipTemplate.Header = Header;
TooltipTemplate.Row = Row;

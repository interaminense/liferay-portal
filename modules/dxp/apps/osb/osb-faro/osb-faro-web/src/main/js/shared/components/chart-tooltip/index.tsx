import Circle from 'shared/components/Circle';
import React from 'react';
import {TooltipTemplate} from './TooltipTemplate';
import {Alignments, Column, Weights} from './types';

export interface IChartTooltipProps extends React.HTMLAttributes<HTMLElement> {
	header?: {
		columns: Column[];
	}[];
	rows?: {
		columns: Column[];
	}[];
}

const ChartTooltip: React.FC<IChartTooltipProps> = ({header, rows}) => {
	const renderColumn = (columns: Column[], index: number = 0) => (
		<TooltipTemplate.Row key={`rows-${index}`}>
			{columns.map(
				(
					{align, color, colspan, label, truncated, weight, width},
					index
				) => {
					const labelValue =
						typeof label === 'function' ? label() : label;

					return (
						<TooltipTemplate.Column
							align={align}
							colSpan={colspan}
							key={`column-${index}`}
							style={width && {minWidth: `${width}px`}}
							truncated={truncated}
							weight={weight}
						>
							{color && <Circle color={color} />}

							{labelValue}
						</TooltipTemplate.Column>
					);
				}
			)}
		</TooltipTemplate.Row>
	);

	return (
		<TooltipTemplate>
			{!!header && (
				<TooltipTemplate.Header>
					{header.map(({columns}, index) =>
						renderColumn(columns, index)
					)}
				</TooltipTemplate.Header>
			)}

			{!!rows && (
				<TooltipTemplate.Body>
					{rows.map(({columns}, index) =>
						renderColumn(columns, index)
					)}
				</TooltipTemplate.Body>
			)}
		</TooltipTemplate>
	);
};

export default ChartTooltip;

export {Alignments, Weights};

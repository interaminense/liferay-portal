import Metrics, {tooltipLabelTitle} from '../Metrics';
import React from 'react';
import {format} from 'd3';
import {getDate} from 'shared/util/date';
import {Map} from 'immutable';
import {RangeKeyTimeRanges} from 'shared/util/constants';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

const dateKeysIMap = Map(
	[
		'2018-01-01',
		'2018-01-02',
		'2018-01-03',
		'2018-01-04',
		'2018-01-05'
	].map(date => [getDate(date), date.split('/').map(getDate)])
);

const items = [
	{
		active: true,
		content: {
			details: {
				color: '#287D3C',
				icon: 'caret-top-1',
				label: '20%'
			},
			name: 'visitors',
			title: 'Vistors',
			type: 'visitors',
			value: '123123'
		},
		data: [
			{
				color: '#4B9BFF',
				data: [250, 110, 200, 195, 190],
				id: 'data_1',
				name: 'Data 1'
			},
			{
				data: [90, 80, 250, 295, 200],
				id: 'data_2',
				name: 'Data 2'
			},
			{
				data: [
					getDate('2018-01-01'),
					getDate('2018-01-02'),
					getDate('2018-01-03'),
					getDate('2018-01-04'),
					getDate('2018-01-05')
				],
				id: 'x'
			}
		],
		dateKeysIMap,
		format: format('4.3s'),
		intervals: [
			getDate('2018-01-01'),
			getDate('2018-01-02'),
			getDate('2018-01-03'),
			getDate('2018-01-04'),
			getDate('2018-01-05')
		],
		labels: {
			previousValueKey: [
				[getDate('2018-02-01')],
				[getDate('2018-02-02')],
				[getDate('2018-02-03')],
				[getDate('2018-02-04')],
				[getDate('2018-02-05')]
			],
			title: 'views',
			valueKey: [
				[getDate('2018-03-01')],
				[getDate('2018-03-02')],
				[getDate('2018-03-03')],
				[getDate('2018-03-04')],
				[getDate('2018-03-05')]
			]
		}
	},
	{
		content: {
			details: {
				label: '20%',
				positive: false
			},
			title: 'Users',
			type: 'number',
			value: '12.2k'
		},
		data: [
			{
				color: '#4B9BFF',
				data: [250, 210, 200, 195, 190],
				id: 'data_1',
				name: 'Data 1'
			},
			{
				data: [90, 180, 150, 195, 270],
				id: 'data_2',
				name: 'Data 2'
			},
			{
				data: [
					getDate('2018-01-01'),
					getDate('2018-01-02'),
					getDate('2018-01-03'),
					getDate('2018-01-04'),
					getDate('2018-01-05')
				],
				id: 'x'
			}
		],
		dateKeysIMap,
		format: format('4.3s'),
		intervals: [
			getDate('2018-01-01'),
			getDate('2018-01-02'),
			getDate('2018-01-03'),
			getDate('2018-01-04'),
			getDate('2018-01-05')
		],
		labels: {
			previousValueKey: [
				[getDate('2018-02-01')],
				[getDate('2018-02-02')],
				[getDate('2018-02-03')],
				[getDate('2018-02-04')],
				[getDate('2018-02-05')]
			],
			title: 'views',
			valueKey: [
				[getDate('2018-03-01')],
				[getDate('2018-03-02')],
				[getDate('2018-03-03')],
				[getDate('2018-03-04')],
				[getDate('2018-03-05')]
			]
		}
	},
	{
		content: {
			details: {
				label: '20%',
				positive: true
			},
			title: 'Views',
			type: 'number',
			value: '220.5k'
		},
		data: [
			{
				color: '#4B9BFF',
				data: [250, 210, 100, 195, 190],
				id: 'data_1',
				name: 'Data 1'
			},
			{
				data: [90, 180, 150, 195, 270],
				id: 'data_2',
				name: 'Data 2'
			},
			{
				data: [
					getDate('2018-01-01'),
					getDate('2018-01-02'),
					getDate('2018-01-03'),
					getDate('2018-01-04'),
					getDate('2018-01-05')
				],
				id: 'x'
			}
		],
		dateKeysIMap,
		format: format('4.3s'),
		intervals: [
			getDate('2018-01-01'),
			getDate('2018-01-02'),
			getDate('2018-01-03'),
			getDate('2018-01-04'),
			getDate('2018-01-05')
		],
		labels: {
			previousValueKey: [
				[getDate('2018-02-01')],
				[getDate('2018-02-02')],
				[getDate('2018-02-03')],
				[getDate('2018-02-04')],
				[getDate('2018-02-05')]
			],
			title: 'views',
			valueKey: [
				[getDate('2018-03-01')],
				[getDate('2018-03-02')],
				[getDate('2018-03-03')],
				[getDate('2018-03-04')],
				[getDate('2018-03-05')]
			]
		}
	}
];
describe('Metrics', () => {
	it('should render', () => {
		const {container} = render(
			<Metrics
				items={items}
				rangeSelectors={{rangeKey: RangeKeyTimeRanges.Last24Hours}}
			/>
		);
		expect(container).toMatchSnapshot();
	});
});

describe('tooltipLabelTitle', () => {
	it('should return tooltip label for last 24 days', () => {
		expect(tooltipLabelTitle(RangeKeyTimeRanges.Last24Hours)).toEqual(
			'Time'
		);
	});

	it('should return tooltip label for yesterday', () => {
		expect(tooltipLabelTitle(RangeKeyTimeRanges.Yesterday)).toEqual('Time');
	});

	it('should return tooltip label for last 30 days', () => {
		expect(tooltipLabelTitle(RangeKeyTimeRanges.Last30Days)).toEqual(
			'Date'
		);
	});

	it('should return tooltip label for last 90 days', () => {
		expect(tooltipLabelTitle(RangeKeyTimeRanges.Last90Days)).toEqual(
			'Date'
		);
	});
});

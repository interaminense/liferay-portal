import CohortAnalysis from '../index';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {DAY, VISITORS} from '../utils';

jest.unmock('react-dom');

describe('CohortAnalysis', () => {
	afterEach(cleanup);

	it('should render', () => {
		const mockData = {
			visitors: {
				items: [
					{
						colDimension: '0',
						retention: 0.0,
						rowDimension: '0',
						rowKey: null,
						value: 0.0
					},
					{
						colDimension: '0',
						retention: 0.0,
						rowDimension: '1',
						rowKey: '2019-08-14',
						value: 0.0
					},
					{
						colDimension: '0',
						retention: 0.0,
						rowDimension: '2',
						rowKey: '2019-08-15',
						value: 0.0
					},
					{
						colDimension: '0',
						retention: 0.0,
						rowDimension: '3',
						rowKey: '2019-08-16',
						value: 0.0
					},
					{
						colDimension: '1',
						retention: 0.0,
						rowDimension: '0',
						rowKey: null,
						value: 0.0
					},
					{
						colDimension: '1',
						retention: 0.0,
						rowDimension: '1',
						rowKey: '2019-08-14',
						value: 0.0
					},
					{
						colDimension: '1',
						retention: 0.0,
						rowDimension: '2',
						rowKey: '2019-08-15',
						value: 0.0
					},
					{
						colDimension: '1',
						retention: 0.0,
						rowDimension: '3',
						rowKey: '2019-08-16',
						value: 0.0
					},
					{
						colDimension: '2',
						retention: 0.0,
						rowDimension: '0',
						rowKey: null,
						value: 0.0
					},
					{
						colDimension: '2',
						retention: 0.0,
						rowDimension: '1',
						rowKey: '2019-08-14',
						value: 0.0
					},
					{
						colDimension: '2',
						retention: 0.0,
						rowDimension: '2',
						rowKey: '2019-08-15',
						value: 0.0
					}
				]
			}
		};

		const {container} = render(
			<CohortAnalysis
				data={mockData}
				interval={DAY}
				visitorsType={VISITORS}
			/>
		);

		expect(container).toMatchSnapshot();
	});
});

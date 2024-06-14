import OperatorSelect from '../OperatorSelect';
import React from 'react';
import {ATTRIBUTES_NUMBER_OPERATOR_LONGHAND_LABELS_MAP} from '../utils';
import {cleanup, fireEvent, render} from '@testing-library/react';
import {DataTypes, Operators} from 'event-analysis/utils/types';

jest.unmock('react-dom');

describe('OperatorSelect', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container, getByText} = render(
			<OperatorSelect
				dataType={DataTypes.Number}
				onChange={jest.fn()}
				operatorsName={
					ATTRIBUTES_NUMBER_OPERATOR_LONGHAND_LABELS_MAP[Operators.EQ]
				}
			/>
		);
		fireEvent.click(getByText('Select an option'));

		expect(getByText('greater than')).toBeTruthy();
		expect(getByText('less than')).toBeTruthy();
		expect(getByText('is equal to')).toBeTruthy();
		expect(getByText('is not equal to')).toBeTruthy();

		expect(container).toMatchSnapshot();
	});
});

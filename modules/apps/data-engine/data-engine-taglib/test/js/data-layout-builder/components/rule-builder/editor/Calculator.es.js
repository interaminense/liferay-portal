/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import {act, cleanup, fireEvent, render} from '@testing-library/react';
import React from 'react';

import Calculator from '../../../../../../src/main/resources/META-INF/resources/data_layout_builder/js/components/rule-builder/editor/Calculator.es';

const fields = [
	{
		dataType: 'integer',
		fieldName: 'number1',
		name: 'number1',
		options: [],
		repeatable: true,
		title: 'option1repeatablefieldName',
		type: 'numeric',
		value: 'option1repeatablefieldName',
	},
	{
		dataType: 'integer',
		fieldName: 'option1nonrepeatablefieldName',
		name: 'option1',
		options: [],
		repeatable: false,
		title: 'option1nonrepeatablefieldName',
		type: 'numeric',
		value: 'option1nonrepeatablefieldName',
    },
    {
		dataType: 'integer',
		fieldName: 'option1nonrepeatablefieldName',
		name: 'option1',
		options: [],
		repeatable: false,
		title: 'option1nonrepeatablefieldName',
		type: 'numeric',
		value: 'option1nonrepeatablefieldName',
	},
];

describe('Calculator', () => {
    it('renders', () => {
		const {asFragment} = render(
            <Calculator
                expression = ''
                fields={fields}
                functions = {[
                    {
                        label: 'sum',
                        tooltip: '',
                        value: 'sum',
                    },
                ]}
                index = {0}
            />
		);

		expect(asFragment()).toMatchSnapshot();
	});
});

import Form from 'shared/components/form';
import Interactions from '../Interactions';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {JobRunDataPeriods} from 'shared/util/constants';

jest.unmock('react-dom');

describe('Interactions', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<Form
				initialValues={{
					includePreviousPeriod: false,
					runDataPeriod: JobRunDataPeriods.Last30Days
				}}
			>
				{() => (
					<Form.Form>
						<Interactions />
					</Form.Form>
				)}
			</Form>
		);

		expect(container).toMatchSnapshot();
	});

	it('should render with Include Previous Period Checkbox Checked', () => {
		const {queryByTestId} = render(
			<Form
				initialValues={{
					includePreviousPeriod: true,
					runDataPeriod: JobRunDataPeriods.Last30Days
				}}
			>
				{() => (
					<Form.Form>
						<Interactions />
					</Form.Form>
				)}
			</Form>
		);

		const checkbox = queryByTestId('include-previous-period-checkbox');

		expect(checkbox.checked).toBeTrue();
	});
});

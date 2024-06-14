import toggleSwitch from '../ToggleSwitch';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('ToggleSwitch', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(toggleSwitch({field: {}}));

		expect(container).toMatchSnapshot();
	});

	it('should render with an initial value', () => {
		const {getByTestId} = render(toggleSwitch({field: {value: true}}));

		expect(getByTestId('toggle-switch-input')).toHaveAttribute(
			'value',
			'true'
		);
	});
});

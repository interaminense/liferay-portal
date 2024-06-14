import FieldPreviewModal from '../FieldPreviewModal';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {noop} from 'lodash';

jest.unmock('react-dom');

const DefaultComponent = props => (
	<FieldPreviewModal
		dataSourceFn={() => Promise.resolve()}
		onClose={noop}
		sourceName='foo'
		{...props}
	/>
);

describe('FieldPreviewModal', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<DefaultComponent />);

		expect(container).toMatchSnapshot();
	});

	it('should render with fieldname', () => {
		const fieldName = 'bar';

		const {getByText} = render(<DefaultComponent fieldName={fieldName} />);

		expect(getByText(fieldName)).toBeTruthy();
	});
});

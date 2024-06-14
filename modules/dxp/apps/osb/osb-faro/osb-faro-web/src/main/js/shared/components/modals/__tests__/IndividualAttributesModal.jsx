import IndividualAttributesModal from '../IndividualAttributesModal';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {mockIndividualAttributes} from 'test/data';
import {noop} from 'lodash';

const {dataSources, fieldName} = mockIndividualAttributes();

jest.unmock('react-dom');

describe('IndividualAttributesModal', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<IndividualAttributesModal
				dataSources={dataSources}
				fieldName={fieldName}
				onClose={noop}
			/>
		);

		expect(container).toMatchSnapshot();
	});
});

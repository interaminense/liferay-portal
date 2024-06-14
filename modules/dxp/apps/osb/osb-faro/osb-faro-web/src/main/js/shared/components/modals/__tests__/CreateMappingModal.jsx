import CreateMappingModal from '../CreateMappingModal';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {noop} from 'lodash';

jest.unmock('react-dom');

describe('CreateMappingModal', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<CreateMappingModal groupId='23' onClose={noop} />
		);

		expect(container).toMatchSnapshot();
	});
});

import withDataSource from '../WithDataSource';
import {cleanup} from '@testing-library/react';
import {renderWithStore} from 'test/mock-store';

jest.unmock('react-dom');

jest.mock('shared/hoc/WithAction', () => () => wrappedComponent =>
	wrappedComponent
);

describe('WithDataSource', () => {
	afterEach(cleanup);

	it('should pass dataSource to the WrappedComponent', () => {
		let result = null;

		const MockComponent = props => {
			result = props;

			return null;
		};

		const WrappedComponent = withDataSource(MockComponent);

		renderWithStore(WrappedComponent, {
			dataSource: 'fooDataSource',
			id: 'test'
		});

		expect(result.dataSource).toBe('fooDataSource');
	});
});

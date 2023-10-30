import React from 'react';
import {render} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';
import {unmountComponentAtNode} from 'react-dom';
import {useLoadingStatus} from '../useLoadingStatus';

jest.unmock('react-dom');

let container = null;

beforeEach(() => {
	container = document.createElement('div');

	document.body.appendChild(container);
});

afterEach(() => {
	unmountComponentAtNode(container);

	container.remove();
});

const LoadingComponent = () => <div className='loading-root' />;

describe('useLoadingStatus', () => {
	it('returns true if it has a loading element in the DOM', async () => {
		render(<LoadingComponent />, container);

		const {result} = renderHook(() => useLoadingStatus());

		expect(result.current).toBe(true);
	});

	it('returns false if it has not a loading element in the DOM', () => {
		render(null, container);

		const {result} = renderHook(() => useLoadingStatus());

		expect(result.current).toBe(false);
	});
});

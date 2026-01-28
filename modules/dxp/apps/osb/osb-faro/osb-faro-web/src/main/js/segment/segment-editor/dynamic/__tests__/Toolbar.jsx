import * as API from 'shared/api';
import * as data from 'test/data';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {cleanup, render} from '@testing-library/react';
import {Formik} from 'formik';
import {Toolbar} from '../Toolbar';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.unmock('react-dom');

describe('Toolbar', () => {
	afterEach(() => {
		jest.clearAllMocks();

		cleanup();
	});

	it('should render', () => {
		const {container} = render(
			<BrowserRouter>
				<Formik>
					<Toolbar
						channelId='321'
						criteria={data.mockNewCriteria(1, {valid: false})}
						groupId='123'
						segmentType='BATCH'
					/>
				</Formik>
			</BrowserRouter>
		);
		expect(container).toMatchSnapshot();
	});

	it('should render w/ preview button disabled if criteria is valid and total members count is equal to 0', () => {
		const {getByTestId} = render(
			<BrowserRouter>
				<Formik>
					<Toolbar
						channelId='321'
						criteria={data.mockNewCriteria(1, {valid: true})}
						groupId='123'
						segmentType='BATCH'
					/>
				</Formik>
			</BrowserRouter>
		);

		expect(getByTestId('preview-criteria-button')).toBeDisabled();
	});

	it('should render w/ preview button disabled if criteria is not valid', () => {
		const {getByTestId} = render(
			<BrowserRouter>
				<Formik>
					<Toolbar
						channelId='321'
						criteria={data.mockNewCriteria(1, {valid: false})}
						groupId='123'
						segmentType='BATCH'
					/>
				</Formik>
			</BrowserRouter>
		);

		expect(getByTestId('preview-criteria-button')).toBeDisabled();
	});

	it('should render w/ preview button enabled if total members count is bigger thant 0', async () => {
		API.individuals.search.mockReturnValue(Promise.resolve({total: 1}));

		const {container, getByTestId} = render(
			<BrowserRouter>
				<Formik>
					<Toolbar
						channelId='321'
						criteria={data.mockNewCriteria(1, {valid: true})}
						groupId='123'
						segmentType='BATCH'
					/>
				</Formik>
			</BrowserRouter>
		);

		await waitForLoadingToBeRemoved(container);

		expect(getByTestId('preview-criteria-button')).toBeEnabled();
	});
});

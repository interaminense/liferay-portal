import * as data from 'test/data';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {Formik} from 'formik';
import {StaticRouter} from 'react-router';
import {Toolbar} from '../Toolbar';

jest.unmock('react-dom');

describe('Toolbar', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<StaticRouter>
				<Formik>
					<Toolbar
						channelId='321'
						criteria={data.mockNewCriteria(1, {valid: false})}
						groupId='123'
					/>
				</Formik>
			</StaticRouter>
		);
		expect(container).toMatchSnapshot();
	});

	it('should render w/ preview button disabled', () => {
		const {getByTestId} = render(
			<StaticRouter>
				<Formik>
					<Toolbar
						channelId='321'
						criteria={data.mockNewCriteria(1, {valid: false})}
						groupId='123'
					/>
				</Formik>
			</StaticRouter>
		);

		expect(getByTestId('preview-criteria-button')).toBeDisabled();
	});

	it('should render w/ preview button enabled', () => {
		const {getByTestId} = render(
			<StaticRouter>
				<Formik>
					<Toolbar
						channelId='321'
						criteria={data.mockNewCriteria(1, {valid: true})}
						groupId='123'
					/>
				</Formik>
			</StaticRouter>
		);

		expect(getByTestId('preview-criteria-button')).toBeEnabled();
	});
});

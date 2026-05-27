import * as API from 'shared/api';
import CheckSegmentLink from '../CheckSegmentLink';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {createMemoryHistory} from 'history';
import {Router} from 'react-router-dom';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.unmock('react-dom');

const RenderText = () => 'Wrapped component text';

const renderAt = (ui, pathname) => {
	const history = createMemoryHistory({initialEntries: [pathname]});

	const replaceSpy = jest.spyOn(history, 'replace');

	const result = render(<Router history={history}>{ui}</Router>);

	return {...result, history, replaceSpy};
};

describe('CheckSegmentLink', () => {
	afterEach(cleanup);

	it('should render', () => {
		const WrappedComponent = CheckSegmentLink(RenderText);

		const {getByText} = renderAt(
			<WrappedComponent />,
			'/workspace/faro-dev-liferay/123/contacts/segments/456'
		);

		expect(getByText('Wrapped component text')).toBeTruthy();
	});

	it('should request and replace url if channelId is not in location', async () => {
		const WrappedComponent = CheckSegmentLink(RenderText);

		API.individualSegment.fetch.mockReturnValueOnce(
			Promise.resolve({channelId: 123, id: 456})
		);

		const {container, replaceSpy} = renderAt(
			<WrappedComponent groupId='faro-dev-liferay' />,
			'/workspace/faro-dev-liferay/contacts/segments/456'
		);

		jest.runAllTimers();

		await waitForLoadingToBeRemoved(container);

		expect(replaceSpy).toBeCalledWith(
			'/workspace/faro-dev-liferay/123/contacts/segments/456'
		);
	});
});

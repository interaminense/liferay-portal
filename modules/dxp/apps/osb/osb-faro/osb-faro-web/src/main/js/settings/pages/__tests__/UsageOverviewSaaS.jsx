import * as data from 'test/data';
import mockStore from 'test/mock-store';
import React from 'react';
import UsageOverviewSaaS from '../UsageOverviewSaaS';
import {AppContext} from '../../../AppContext';
import {fromJS} from 'immutable';
import {Project} from 'shared/util/records';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';
import {StaticRouter} from 'react-router';

jest.unmock('react-dom');

jest.mock('shared/hooks/useTimeZone', () => ({
	useTimeZone: () => ({timeZoneId: 'UTC'})
}));

jest.mock('shared/hooks/useCurrentUser', () => ({
	useCurrentUser: jest.fn()
}));

const defaultProps = {
	groupId: '23',
	project: new Project(
		data.mockProject(23, {
			faroSubscription: fromJS(
				data.mockSubscription({
					name: 'Liferay SaaS - Enterprise Plan'
				})
			)
		})
	)
};

const WrappedComponent = props => (
	<AppContext.Provider value={props.currentUser}>
		<Provider store={mockStore()}>
			<StaticRouter>
				<UsageOverviewSaaS {...props} />
			</StaticRouter>
		</Provider>
	</AppContext.Provider>
);

describe('UsageOverviewSaaS', () => {
	it('should render', () => {
		const {container} = render(
			<WrappedComponent
				currentUser={{isAdmin: () => true}}
				{...defaultProps}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('should render the Hero Banner', () => {
		const {container} = render(<WrappedComponent {...defaultProps} />);

		expect(container.querySelector('.saas-banner')).toBeTruthy();
	});

	it('should render the "Usage Overview" page for SaaS title', () => {
		const {getByText} = render(<WrappedComponent {...defaultProps} />);

		expect(getByText('View Your SaaS Project Metrics')).toBeInTheDocument();
	});

	it('should render the "Go to Customer Portal" button for admin user', () => {
		const {queryByText} = render(
			<WrappedComponent
				currentUser={{isAdmin: () => true}}
				{...defaultProps}
			/>
		);

		expect(queryByText('Go to Customer Portal')).toBeInTheDocument();
	});

	it('should not render the "Go to Customer Portal" button for member user', () => {
		const {queryByText} = render(
			<WrappedComponent
				currentUser={{isAdmin: () => true}}
				{...defaultProps}
			/>
		);

		expect(queryByText('Go to Customer Portal')).toBeNull();
	});

	it('should render the "Sites and Users" and "Resource Usage" sections', () => {
		const {getByText} = render(<WrappedComponent {...defaultProps} />);

		expect(getByText('Sites and Users')).toBeInTheDocument();
		expect(getByText('Resource Usage')).toBeInTheDocument();
	});
});

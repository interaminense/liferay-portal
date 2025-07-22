/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, {useContext, useEffect} from 'react';

import {
	AnalyticsReportsContext,
	AnalyticsReportsProvider,
} from '../../../js/AnalyticsReportsContext';
import {Metrics} from '../../../js/components/cms/Metrics';

const metricsMock = {
	defaultMetric: {
		metricType: 'IMPRESSIONS',
		trend: {
			percentage: 0,
			trendClassification: 'NEUTRAL',
		},
		value: 11,
	},
	selectedMetrics: [
		{
			metricType: 'IMPRESSIONS',
			trend: {
				percentage: 0,
				trendClassification: 'NEUTRAL',
			},
			value: 11,
		},
		{
			metricType: 'VIEWS',
			trend: {
				percentage: -12.3,
				trendClassification: 'NEGATIVE',
			},
			value: 25321,
		},

		{
			metricType: 'DOWNLOADS',
			trend: {
				percentage: 32.1,
				trendClassification: 'POSITIVE',
			},
			value: 220153310,
		},
	],
};

const MetricsWithData = () => {
	const {changeMetricFilter, filters} = useContext(AnalyticsReportsContext);

	useEffect(() => {
		if (filters.metric === 'UNDEFINED') {
			changeMetricFilter('IMPRESSIONS');
		}
	}, [changeMetricFilter, filters.metric]);

	return <Metrics assetId={0} spaceId={0} {...metricsMock} />;
};

const WrapperComponent = () => {
	return (
		<AnalyticsReportsProvider>
			<MetricsWithData />
		</AnalyticsReportsProvider>
	);
};

describe('CMS Asset Type Info Panel Metrics Component', () => {
	it('renders all cards', async () => {
		const {container} = render(<WrapperComponent />);

		expect(container).toBeInTheDocument();

		const metricsCards = screen.getAllByRole('button');

		expect(metricsCards.length).toBe(3);

		const buttonTexts = metricsCards.map(
			(element) => element.children[0].textContent
		);

		expect(buttonTexts).toEqual(['IMPRESSIONS', 'VIEWS', 'DOWNLOADS']);
	});

	it('formats the total numbers', () => {
		render(<WrapperComponent />);

		const impressionsCard = screen.getByRole('button', {
			name: /impressions/i,
		});
		const viewsCard = screen.getByRole('button', {name: /views/i});
		const downloadsCard = screen.getByRole('button', {
			name: /downloads/i,
		});

		within(impressionsCard).getByText('11', {selector: '.text-7'});

		within(viewsCard).getByText('25.32K', {selector: '.text-7'});

		within(downloadsCard).getByText('220.15M', {
			selector: '.text-7',
		});
	});

	it('formats the comparison numbers', () => {
		render(<WrapperComponent />);

		const impressionsCard = screen.getByRole('button', {
			name: /impressions/i,
		});
		const viewsCard = screen.getByRole('button', {name: /views/i});
		const downloadsCard = screen.getByRole('button', {
			name: /downloads/i,
		});

		const impressionsComparisonElement =
			within(impressionsCard).getByText(/0%/i);
		expect(impressionsComparisonElement.textContent).toBe('0%');

		const viewsComparisonElement = within(viewsCard).getByText(/12\.3%/i);
		expect(viewsComparisonElement.textContent).toBe('12.3%');

		const downloadsComparisonElement =
			within(downloadsCard).getByText(/32\.1%/i);
		expect(downloadsComparisonElement.textContent).toBe('32.1%');
	});

	it('uses the right colors to render the comparison numbers', () => {
		render(<WrapperComponent />);

		const impressionsComparisonText = screen.getByText(/0%/i);
		expect(impressionsComparisonText).toHaveClass('text-secondary');

		const viewsCardComparisonText = screen.getByText(/12.3%/i);
		expect(viewsCardComparisonText).toHaveClass('text-danger');

		const downloadsCardComparisonText = screen.getByText(/32.1%/i);
		expect(downloadsCardComparisonText).toHaveClass('text-success');
	});

	it('allows keyboard navigation and selection', async () => {
		render(<WrapperComponent />);

		const impressionsCard = screen.getByRole('button', {
			name: /impressions/i,
		});
		const viewsCard = screen.getByRole('button', {name: /views/i});
		const downloadsCard = screen.getByRole('button', {
			name: /downloads/i,
		});

		expect(impressionsCard).toHaveAttribute('aria-pressed', 'true');

		await userEvent.tab();
		expect(impressionsCard).toHaveFocus();

		await userEvent.tab();
		expect(viewsCard).toHaveFocus();

		await userEvent.tab();
		expect(downloadsCard).toHaveFocus();

		await userEvent.keyboard('{enter}');

		await waitFor(() => {
			expect(impressionsCard).toHaveAttribute('aria-pressed', 'false');
			expect(viewsCard).toHaveAttribute('aria-pressed', 'false');
			expect(downloadsCard).toHaveAttribute('aria-pressed', 'true');
		});

		await userEvent.tab({shift: true});

		expect(viewsCard).toHaveFocus();

		await userEvent.keyboard(' ');

		await waitFor(() => {
			expect(impressionsCard).toHaveAttribute('aria-pressed', 'false');
			expect(viewsCard).toHaveAttribute('aria-pressed', 'true');
			expect(downloadsCard).toHaveAttribute('aria-pressed', 'false');
		});
	});
});

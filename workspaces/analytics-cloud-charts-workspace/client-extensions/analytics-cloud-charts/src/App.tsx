/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayEmptyState from '@clayui/empty-state';
import ClayPopover from '@clayui/popover';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {AcquisitionsCard} from './components/acquisitions-card/AcquisitionsCard';
import {AudienceCompositionCard} from './components/audience-composition-card/AudienceCompositionCard';
import Card from './components/Card';
import {DevicesCard} from './components/devices-card/DevicesCard';
import {DropdownRangeKey} from './components/dropdown-range-key/DropdownRangeKey';
import ErrorDisplay from './components/ErrorDisplay';
import {PageEngagementCard} from './components/page-engagement-card/PageEngagementCard';
import {PageOverviewCard} from './components/page-overview-card/PageOverviewCard';
import {PagePathCard} from './components/page-path-card/PagePathCard';
import {ScopeBadge} from './components/ScopeBadge';
import {SetupRequiredEmptyState} from './components/SetupRequiredEmptyState';
import {SearchTermsCard} from './components/search-terms-card/SearchTermsCard';
import {SiteOverviewCard} from './components/site-overview-card/SiteOverviewCard';
import {TopPagesCard} from './components/top-pages-card/TopPagesCard';
import {TrafficHeatmapCard} from './components/traffic-heatmap-card/TrafficHeatmapCard';
import {VisitFrequencyCard} from './components/visit-frequency-card/VisitFrequencyCard';
import {SettingsModal} from './components/SettingsModal';
import StatesRenderer from './components/states-renderer/StatesRenderer';
import {useChannelId} from './hooks/useChannelId';
import {Metric, usePreferences} from './hooks/usePreferences';
import {ChartPaletteProvider} from './lib/chart-palette';
import {EMPTY_STATE_IMG_SRC} from './lib/liferay';
import {METRIC_INFO} from './lib/metric-info';
import {RangeSelectors} from './lib/types';

const METRIC_LABEL: Record<Metric, string> = {
	'': 'Analytics',
	acquisitions: 'Acquisitions',
	audienceComposition: 'Audience Size',
	devices: 'Devices',
	pageEngagement: 'Page Engagement',
	pageOverview: 'Page Overview',
	pagePath: 'Page Path',
	searchTerms: 'Search Terms',
	siteOverview: 'Site Overview',
	topPages: 'Top Pages',
	trafficHeatmap: 'Traffic Heatmap',
	visitFrequency: 'Visit Frequency',
};

interface AppProps {
	instanceId: string;
}

const SettingsIcon: React.FC = () => (
	<svg
		aria-hidden="true"
		fill="currentColor"
		focusable="false"
		height="16"
		viewBox="0 0 512 512"
		width="16"
	>
		<path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3l-42.6 24.6c-17.9-15.4-38.5-27.3-60.8-35.1V25c0-5.5-3.8-10.3-9.2-11.5-36.7-8.2-74.3-7.8-109.2 0-5.4 1.2-9.2 6-9.2 11.5v49.2c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 84.7c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 220c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1V487c0 5.5 3.8 10.3 9.2 11.5 36.7 8.2 74.3 7.8 109.2 0 5.4-1.2 9.2-6 9.2-11.5v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" />
	</svg>
);

const InfoIcon: React.FC = () => (
	<svg
		aria-hidden="true"
		fill="currentColor"
		focusable="false"
		height="14"
		viewBox="0 0 24 24"
		width="14"
	>
		<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
	</svg>
);

const App: React.FC<AppProps> = ({instanceId}) => {
	const isSignedIn = useMemo(
		() => Boolean(window.themeDisplay?.isSignedIn?.()),
		[]
	);

	const [rangeSelectors, setRangeSelectors] = useState<
		RangeSelectors | undefined
	>();

	const [settingsOpen, setSettingsOpen] = useState(false);

	const {
		data: discoveredChannelId,
		error: channelError,
		loading: channelLoading,
	} = useChannelId();

	const {
		canEdit,
		error: preferencesError,
		loading: preferencesLoading,
		preferences,
		setupRequired,
		updatePreferences,
	} = usePreferences(instanceId);

	const channelId = discoveredChannelId ?? preferences.channelId;

	const metric: Metric = preferences.metric ?? '';

	useEffect(() => {
		if (
			canEdit &&
			!preferencesLoading &&
			discoveredChannelId &&
			discoveredChannelId !== preferences.channelId
		) {
			updatePreferences({channelId: discoveredChannelId});
		}
	}, [
		canEdit,
		discoveredChannelId,
		preferences.channelId,
		preferencesLoading,
		updatePreferences,
	]);

	useEffect(() => {
		if (
			preferences.rangeKey != null &&
			rangeSelectors?.rangeKey !== preferences.rangeKey
		) {
			setRangeSelectors({
				rangeEnd: null,
				rangeKey: preferences.rangeKey,
				rangeStart: null,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preferences.rangeKey]);

	const handleRangeSelectorChange = useCallback(
		(next: RangeSelectors) => setRangeSelectors(next),
		[]
	);

	const handleSettingsSave = useCallback(
		({
			aiInsightsEnabled: nextAiInsightsEnabled,
			chartColors: nextChartColors,
			metric: nextMetric,
			rangeKey: nextRangeKey,
		}: {
			aiInsightsEnabled: boolean;
			chartColors: string[] | undefined;
			metric: Metric;
			rangeKey: number | undefined;
		}) => {
			const partial: {
				aiInsightsEnabled?: boolean;
				chartColors?: string[];
				metric?: Metric;
				rangeKey?: number;
			} = {};

			if (nextMetric !== preferences.metric) {
				partial.metric = nextMetric;
			}

			if (
				nextRangeKey != null &&
				nextRangeKey !== preferences.rangeKey
			) {
				partial.rangeKey = nextRangeKey;
			}

			const previousColors = preferences.chartColors ?? [];
			const colorsChanged =
				(nextChartColors?.length ?? 0) !== previousColors.length ||
				(nextChartColors ?? []).some(
					(color, index) => color !== previousColors[index]
				);

			if (colorsChanged) {
				partial.chartColors = nextChartColors;
			}

			if (
				nextAiInsightsEnabled !==
				!!preferences.aiInsightsEnabled
			) {
				partial.aiInsightsEnabled = nextAiInsightsEnabled;
			}

			if (Object.keys(partial).length > 0) {
				updatePreferences(partial);
			}
		},
		[
			preferences.aiInsightsEnabled,
			preferences.chartColors,
			preferences.metric,
			preferences.rangeKey,
			updatePreferences,
		]
	);

	const pageContext = useMemo(
		() => ({
			title: typeof document !== 'undefined' ? document.title : '',
			touchpoint:
				typeof window !== 'undefined'
					? window.location.origin + window.location.pathname
					: '',
		}),
		[]
	);

	const renderMetricContent = () => {
		if (!channelId || !rangeSelectors) {
			return null;
		}

		const aiInsightsEnabled = !!preferences.aiInsightsEnabled;

		if (metric === 'acquisitions') {
			return (
				<AcquisitionsCard
					aiInsightsEnabled={aiInsightsEnabled}
					channelId={channelId}
					rangeSelectors={rangeSelectors}
				/>
			);
		}

		if (metric === 'audienceComposition') {
			return (
				<AudienceCompositionCard
					aiInsightsEnabled={aiInsightsEnabled}
					channelId={channelId}
					rangeSelectors={rangeSelectors}
				/>
			);
		}

		if (metric === 'devices') {
			return (
				<DevicesCard
					aiInsightsEnabled={aiInsightsEnabled}
					channelId={channelId}
					rangeSelectors={rangeSelectors}
					title={pageContext.title}
					touchpoint={pageContext.touchpoint}
				/>
			);
		}

		if (metric === 'pageEngagement') {
			return (
				<PageEngagementCard
					aiInsightsEnabled={aiInsightsEnabled}
					channelId={channelId}
					rangeSelectors={rangeSelectors}
					title={pageContext.title}
					touchpoint={pageContext.touchpoint}
				/>
			);
		}

		if (metric === 'pageOverview') {
			return (
				<PageOverviewCard
					aiInsightsEnabled={aiInsightsEnabled}
					channelId={channelId}
					rangeSelectors={rangeSelectors}
					title={pageContext.title}
					touchpoint={pageContext.touchpoint}
				/>
			);
		}

		if (metric === 'pagePath') {
			return (
				<PagePathCard
					aiInsightsEnabled={aiInsightsEnabled}
					channelId={channelId}
					rangeSelectors={rangeSelectors}
					title={pageContext.title}
					touchpoint={pageContext.touchpoint}
				/>
			);
		}

		if (metric === 'searchTerms') {
			return (
				<SearchTermsCard
					aiInsightsEnabled={aiInsightsEnabled}
					channelId={channelId}
					rangeSelectors={rangeSelectors}
				/>
			);
		}

		if (metric === 'siteOverview') {
			return (
				<SiteOverviewCard
					aiInsightsEnabled={aiInsightsEnabled}
					channelId={channelId}
					rangeSelectors={rangeSelectors}
				/>
			);
		}

		if (metric === 'topPages') {
			return (
				<TopPagesCard
					aiInsightsEnabled={aiInsightsEnabled}
					channelId={channelId}
					rangeSelectors={rangeSelectors}
				/>
			);
		}

		if (metric === 'trafficHeatmap') {
			return (
				<TrafficHeatmapCard
					aiInsightsEnabled={aiInsightsEnabled}
					channelId={channelId}
					rangeSelectors={rangeSelectors}
				/>
			);
		}

		if (metric === 'visitFrequency') {
			return (
				<VisitFrequencyCard
					aiInsightsEnabled={aiInsightsEnabled}
					channelId={channelId}
					rangeSelectors={rangeSelectors}
				/>
			);
		}

		return null;
	};

	const renderEmptyState = () => (
		<ClayEmptyState
			description={
				canEdit
					? 'Click the settings icon above to choose a metric.'
					: 'No metric has been configured yet. Ask an administrator to set one.'
			}
			imgSrc={EMPTY_STATE_IMG_SRC}
			small
			title="No metric selected"
		/>
	);

	const setupLoading =
		preferencesLoading || (!channelId && channelLoading);

	// AC unreachable when channel discovery fails AND we have no cached
	// channelId from preferences. Common when AC isn't connected yet
	// (HTTP 502 "Unable to reach Analytics Cloud" or HTTP 400 "Host name
	// may not be null"). Treat as part of the setup wizard, not a hard error.
	const acUnreachable =
		!channelId && !channelLoading && !!channelError;

	const showSetupWizard = setupRequired || acUnreachable;

	const setupError = channelId ? preferencesError : preferencesError;

	if (!isSignedIn) {
		return (
			<Card className="d-flex flex-column h-100 w-100">
				<Card.Header>
					<Card.Title className="mb-0">Analytics</Card.Title>
				</Card.Header>

				<Card.Body className="d-flex flex-grow-1">
					<ClayEmptyState
						description="Please sign in to view Analytics Cloud charts."
						imgSrc={EMPTY_STATE_IMG_SRC}
						small
						title="Sign in required"
					/>
				</Card.Body>
			</Card>
		);
	}

	if (showSetupWizard && !setupLoading) {
		return (
			<Card className="d-flex flex-column h-100 w-100">
				<Card.Header>
					<Card.Title className="mb-0">Analytics</Card.Title>
				</Card.Header>

				<Card.Body className="d-flex flex-column flex-grow-1 overflow-auto">
					<SetupRequiredEmptyState
						acConnected={!acUnreachable}
						objectCreated={!setupRequired}
					/>
				</Card.Body>
			</Card>
		);
	}

	return (
		<ChartPaletteProvider colors={preferences.chartColors}>
			<Card className="d-flex flex-column h-100 w-100">
				<Card.Header className="align-items-center d-flex justify-content-between">
					<div className="align-items-center d-flex" style={{gap: 8}}>
						<Card.Title className="mb-0">
							{METRIC_LABEL[metric]}
						</Card.Title>

						{metric !== '' && (
							<ScopeBadge scope={METRIC_INFO[metric].scope} />
						)}

						{metric !== '' && (
							<ClayPopover
								alignPosition="bottom-left"
								closeOnClickOutside
								trigger={
									<ClayButton
										aria-label="About this metric"
										className="p-1 text-secondary"
										displayType="unstyled"
										title="About this metric"
									>
										<InfoIcon />
									</ClayButton>
								}
							>
								<div style={{maxWidth: 280}}>
									<div className="font-weight-semi-bold mb-2">
										{METRIC_INFO[metric].label}
									</div>

									<div
										style={{
											fontSize: 13,
											lineHeight: 1.5,
										}}
									>
										{METRIC_INFO[metric].description}
									</div>
								</div>
							</ClayPopover>
						)}
					</div>

					<div className="align-items-center d-flex">
						<DropdownRangeKey
							onRangeSelectorChange={handleRangeSelectorChange}
							rangeSelectors={rangeSelectors}
						/>

						{canEdit && (
							<ClayButton
								aria-label="Open settings"
								className="ml-2"
								displayType="secondary"
								onClick={() => setSettingsOpen(true)}
								small
								title="Settings"
							>
								<SettingsIcon />
							</ClayButton>
						)}
					</div>
				</Card.Header>

				<Card.Body className="d-flex flex-column flex-grow-1 overflow-auto">
					<StatesRenderer
						error={!!setupError}
						loading={setupLoading}
					>
						<StatesRenderer.Error apolloError={setupError}>
							<ErrorDisplay message={setupError?.message} />
						</StatesRenderer.Error>

						<StatesRenderer.Loading />

						<StatesRenderer.Success>
							{metric
								? renderMetricContent()
								: renderEmptyState()}
						</StatesRenderer.Success>
					</StatesRenderer>
				</Card.Body>

				{settingsOpen && (
					<SettingsModal
						initialAiInsightsEnabled={
							preferences.aiInsightsEnabled
						}
						initialChartColors={preferences.chartColors}
						initialMetric={metric}
						initialRangeKey={
							preferences.rangeKey ?? rangeSelectors?.rangeKey
						}
						onClose={() => setSettingsOpen(false)}
						onSave={handleSettingsSave}
					/>
				)}
			</Card>
		</ChartPaletteProvider>
	);
};

export default App;

/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

declare global {
	interface Window {
		Liferay?: {
			authToken?: string;
		};
		themeDisplay?: {
			getCanonicalURL?(): string;
			getLayoutFriendlyURL?(): string;
			getScopeGroupId(): string;
			isSignedIn?(): boolean;
		};
	}
}

export interface Trend {
	percentage: number | null;
	trendClassification: string | null;
}

export interface HistogramMetric {
	previousValue?: number | null;
	trend?: Trend | null;
	value: number | null;
	valueKey?: string | null;
}

export interface HistogramMetricBag {
	metrics?: HistogramMetric[] | null;
	total?: number | null;
}

export interface Metric {
	browser?: Metric[] | null;
	device?: Metric[] | null;
	histogram?: HistogramMetricBag | null;
	metrics?: Metric[] | null;
	name?: string | null;
	previousValue: number | null;
	trend?: Trend | null;
	value: number | null;
	valueKey?: string | null;
}

export interface TimeRange {
	default: boolean | null;
	endLocalDateTime: string | null;
	key: string | null;
	rangeKey: number | null;
	startLocalDateTime: string | null;
}

interface GraphQLResponse<T> {
	data?: T;
	errors?: Array<{message: string}>;
}

export const TIME_RANGE_QUERY = `
	query TimeRange {
		timeRange {
			default
			endLocalDateTime
			key
			rangeKey
			startLocalDateTime
		}
	}
`;

export interface PagePathNode {
	canonicalUrl: string | null;
	external: boolean | null;
	followingPagePathNodes?: PagePathNode[] | null;
	previousPagePathNodes?: PagePathNode[] | null;
	title: string | null;
	views: number | null;
}

export interface PageMetric {
	avgTimeOnPageMetric: Metric | null;
	bounceRateMetric: Metric | null;
	entrancesMetric: Metric | null;
	exitRateMetric: Metric | null;
	visitorsMetric: Metric | null;
	viewsMetric: Metric | null;
}

export interface Composition {
	count: number | null;
	name: string | null;
}

export interface CompositionBag {
	compositions?: Composition[] | null;
	maxCount?: number | null;
	total?: number | null;
	totalCount?: number | null;
}

export interface Acquisitions {
	channel: CompositionBag | null;
	referrer: CompositionBag | null;
	sourceMedium: CompositionBag | null;
}

export interface HeatMapMetric {
	colDimension: string | null;
	rowDimension: string | null;
	value: number | null;
}

export interface IndividualMetric {
	anonymousIndividualsMetric: Metric | null;
	knownIndividualsMetric: Metric | null;
	totalIndividualsMetric: Metric | null;
}

export interface SiteMetric {
	bounceRateMetric: Metric | null;
	sessionDurationMetric: Metric | null;
	sessionsMetric: Metric | null;
	visitorsMetric: Metric | null;
}

export interface VisitFrequencyBag {
	maxCount?: number | null;
	total?: number | null;
	totalCount?: number | null;
	visitFrequency?: Composition[] | null;
}

export interface PageAssetMetric {
	assetId?: string | null;
	assetTitle?: string | null;
	entrancesMetric?: Metric | null;
	exitRateMetric?: Metric | null;
	urls?: (string | null)[] | null;
	visitorsMetric?: Metric | null;
}

export interface AssetMetricBag {
	assetMetrics?: PageAssetMetric[] | null;
	total?: number | null;
}

export interface SortInput {
	column: string;
	type: 'ASC' | 'DESC';
}

export const PAGE_PATH_QUERY = `query PagePath($canonicalUrl: String, $channelId: String, $rangeEnd: String, $rangeKey: Int, $rangeStart: String, $segmentId: String, $title: String!) {
  pagePath(
    canonicalUrl: $canonicalUrl
    channelId: $channelId
    rangeEnd: $rangeEnd
    rangeKey: $rangeKey
    rangeStart: $rangeStart
    segmentId: $segmentId
    title: $title
  ) {
    canonicalUrl
    followingPagePathNodes {
      canonicalUrl
      external
      views
      title
      __typename
    }
    previousPagePathNodes {
      canonicalUrl
      external
      views
      title
      __typename
    }
    views
    title
    __typename
  }
}`;

export const TOUCHPOINT_DEVICES_QUERY = `query TouchpointDevicesQuery($channelId: String, $devices: String, $experienceId: String, $location: String, $rangeEnd: String, $rangeKey: Int, $rangeStart: String, $title: String, $touchpoint: String) {
  page(
    channelId: $channelId
    canonicalUrl: $touchpoint
    country: $location
    deviceType: $devices
    experienceId: $experienceId
    rangeEnd: $rangeEnd
    rangeKey: $rangeKey
    rangeStart: $rangeStart
    title: $title
  ) {
    viewsMetric {
      ...browserFragment
      ...deviceFragment
      previousValue
      value
      __typename
    }
    __typename
  }
}

fragment browserFragment on Metric {
  browser {
    metrics {
      value
      valueKey
      __typename
    }
    value
    valueKey
    __typename
  }
  __typename
}

fragment deviceFragment on Metric {
  device {
    metrics {
      value
      valueKey
      __typename
    }
    value
    valueKey
    __typename
  }
  __typename
}`;

export const PAGE_ENGAGEMENT_QUERY = `query PageEngagementQuery($canonicalUrl: String, $channelId: String, $rangeEnd: String, $rangeKey: Int, $rangeStart: String, $title: String) {
  page(
    canonicalUrl: $canonicalUrl
    channelId: $channelId
    rangeEnd: $rangeEnd
    rangeKey: $rangeKey
    rangeStart: $rangeStart
    title: $title
  ) {
    avgTimeOnPageMetric {
      ...histogramFragment
      __typename
    }
    bounceRateMetric {
      ...histogramFragment
      __typename
    }
    entrancesMetric {
      ...histogramFragment
      __typename
    }
    exitRateMetric {
      ...histogramFragment
      __typename
    }
    visitorsMetric {
      ...histogramFragment
      __typename
    }
    viewsMetric {
      ...histogramFragment
      __typename
    }
    __typename
  }
}

fragment histogramFragment on Metric {
  histogram {
    metrics {
      previousValue
      trend {
        percentage
        trendClassification
        __typename
      }
      value
      valueKey
      __typename
    }
    __typename
  }
  previousValue
  trend {
    percentage
    trendClassification
    __typename
  }
  value
  __typename
}`;

export const ACQUISITIONS_QUERY = `query AcquisitionsQuery($channelId: String, $rangeEnd: String, $rangeKey: Int, $rangeStart: String, $size: Int!, $start: Int!) {
  channel: acquisitions(
    acquisitionType: CHANNEL
    channelId: $channelId
    rangeEnd: $rangeEnd
    rangeKey: $rangeKey
    rangeStart: $rangeStart
    size: $size
    start: $start
  ) {
    ...compositionFragment
    __typename
  }
  referrer: acquisitions(
    acquisitionType: REFERRER
    channelId: $channelId
    rangeEnd: $rangeEnd
    rangeKey: $rangeKey
    rangeStart: $rangeStart
    size: $size
    start: $start
  ) {
    ...compositionFragment
    __typename
  }
  sourceMedium: acquisitions(
    acquisitionType: SOURCE_MEDIUM
    channelId: $channelId
    rangeEnd: $rangeEnd
    rangeKey: $rangeKey
    rangeStart: $rangeStart
    size: $size
    start: $start
  ) {
    ...compositionFragment
    __typename
  }
}

fragment compositionFragment on CompositionBag {
  compositions {
    count
    name
    __typename
  }
  maxCount
  total
  totalCount
  __typename
}`;

export const TRAFFIC_HEATMAP_QUERY = `query TrafficHeatmapQuery($channelId: String, $rangeEnd: String, $rangeKey: Int, $rangeStart: String, $timeZoneId: String) {
  siteVisitorHeatMap(
    channelId: $channelId
    rangeEnd: $rangeEnd
    rangeKey: $rangeKey
    rangeStart: $rangeStart
    timeZoneId: $timeZoneId
  ) {
    colDimension
    rowDimension
    value
    __typename
  }
}`;

export const SEARCH_TERMS_QUERY = `query SearchTermsQuery($channelId: String, $rangeEnd: String, $rangeKey: Int, $rangeStart: String, $size: Int!, $start: Int!) {
  searchTerms(
    channelId: $channelId
    rangeEnd: $rangeEnd
    rangeKey: $rangeKey
    rangeStart: $rangeStart
    size: $size
    start: $start
  ) {
    compositions {
      count
      name
      __typename
    }
    maxCount
    total
    totalCount
    __typename
  }
}`;

export const TOP_PAGES_QUERY = `query TopPagesQuery($channelId: String, $rangeEnd: String, $rangeKey: Int, $rangeStart: String, $size: Int!, $sort: Sort!, $start: Int!) {
  pages(
    channelId: $channelId
    rangeEnd: $rangeEnd
    rangeKey: $rangeKey
    rangeStart: $rangeStart
    size: $size
    sort: $sort
    start: $start
  ) {
    assetMetrics {
      ... on PageMetric {
        assetId
        assetTitle
        entrancesMetric {
          value
          __typename
        }
        exitRateMetric {
          value
          __typename
        }
        urls
        visitorsMetric {
          value
          __typename
        }
        __typename
      }
    }
    total
    __typename
  }
}`;

export const VISIT_FREQUENCY_QUERY = `query VisitFrequencyQuery($channelId: String!, $rangeEnd: String, $rangeKey: Int, $rangeStart: String) {
  visitFrequency(
    channelId: $channelId
    rangeEnd: $rangeEnd
    rangeKey: $rangeKey
    rangeStart: $rangeStart
  ) {
    maxCount
    total
    totalCount
    visitFrequency {
      count
      name
      __typename
    }
    __typename
  }
}`;

export const PAGE_OVERVIEW_QUERY = `query PageOverviewQuery($canonicalUrl: String, $channelId: String, $rangeEnd: String, $rangeKey: Int, $rangeStart: String, $title: String) {
  page(
    canonicalUrl: $canonicalUrl
    channelId: $channelId
    rangeEnd: $rangeEnd
    rangeKey: $rangeKey
    rangeStart: $rangeStart
    title: $title
  ) {
    avgTimeOnPageMetric {
      ...pageOverviewFragment
      __typename
    }
    bounceRateMetric {
      ...pageOverviewFragment
      __typename
    }
    visitorsMetric {
      ...pageOverviewFragment
      __typename
    }
    viewsMetric {
      ...pageOverviewFragment
      __typename
    }
    __typename
  }
}

fragment pageOverviewFragment on Metric {
  histogram {
    metrics {
      previousValue
      value
      valueKey
      __typename
    }
    __typename
  }
  previousValue
  trend {
    percentage
    trendClassification
    __typename
  }
  value
  __typename
}`;

export const SITE_OVERVIEW_QUERY = `query SiteOverviewQuery($channelId: String, $interval: String, $rangeEnd: String, $rangeKey: Int, $rangeStart: String) {
  site(
    channelId: $channelId
    interval: $interval
    rangeEnd: $rangeEnd
    rangeKey: $rangeKey
    rangeStart: $rangeStart
  ) {
    bounceRateMetric {
      ...siteOverviewFragment
      __typename
    }
    sessionDurationMetric {
      ...siteOverviewFragment
      __typename
    }
    sessionsMetric {
      ...siteOverviewFragment
      __typename
    }
    visitorsMetric {
      ...siteOverviewFragment
      __typename
    }
    __typename
  }
}

fragment siteOverviewFragment on Metric {
  histogram {
    metrics {
      previousValue
      value
      valueKey
      __typename
    }
    __typename
  }
  previousValue
  trend {
    percentage
    trendClassification
    __typename
  }
  value
  __typename
}`;

export const AUDIENCE_COMPOSITION_QUERY = `query AudienceCompositionQuery($channelId: String, $rangeKey: Int) {
  individualMetric(
    channelId: $channelId
    rangeKey: $rangeKey
  ) {
    knownIndividualsMetric {
      previousValue
      value
      __typename
    }
    totalIndividualsMetric {
      previousValue
      value
      __typename
    }
    __typename
  }
}`;

export interface RestErrorLike extends Error {
	endpointMissing?: boolean;
	status: number;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null;

export async function restFetch<T>(
	url: string,
	init?: RequestInit
): Promise<T | null> {
	const response = await fetch(url, {
		...init,
		credentials: 'include',
		headers: {
			...init?.headers,
			'x-csrf-token': window.Liferay?.authToken ?? '',
		},
	});

	if (response.status === 204) {
		return null;
	}

	const text = await response.text();

	let parsed: unknown = null;

	try {
		parsed = text ? JSON.parse(text) : null;
	}
	catch {
		parsed = null;
	}

	if (!response.ok) {
		const errorObj = isObject(parsed) ? parsed : null;
		const proxyError = errorObj?.error;
		const proxyMessage = errorObj?.message ?? errorObj?.title;

		const detail =
			proxyError || proxyMessage
				? [proxyError, proxyMessage].filter(Boolean).join(' — ')
				: text || response.statusText;

		const error = new Error(
			`HTTP ${response.status}: ${detail}`
		) as RestErrorLike;

		error.status = response.status;

		// Detect "endpoint missing" — Liferay returns the standard 404 HTML
		// page when an OSGi REST route doesn't exist (e.g. ObjectDefinition
		// not deployed yet). The REST framework's "entry not found" 404
		// returns a JSON body, not HTML.
		if (
			response.status === 404 &&
			!isObject(parsed) &&
			text.trimStart().startsWith('<')
		) {
			error.endpointMissing = true;
		}

		throw error;
	}

	return parsed as T;
}

export async function graphqlFetch<T>(
	query: string,
	variables?: Record<string, unknown>,
	signal?: AbortSignal
): Promise<T> {
	const json = await restFetch<GraphQLResponse<T>>(
		'/o/analytics-rest/v1.0/graphql',
		{
			body: JSON.stringify({query, variables}),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			signal,
		}
	);

	if (json?.errors?.length) {
		throw new Error(
			json.errors.map((entry) => entry.message).join('; ')
		);
	}

	if (!json?.data) {
		throw new Error('GraphQL response is missing the data field');
	}

	return json.data;
}

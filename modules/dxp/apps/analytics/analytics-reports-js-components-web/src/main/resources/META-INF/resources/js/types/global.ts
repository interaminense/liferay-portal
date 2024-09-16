/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export enum Individuals {
	AllIndividuals = 'ALL',
	KnownIndividuals = 'KNOWN',
	AnonymousIndividuals = 'UNKNOWN',
}

export enum RangeSelectors {
	Last24Hours = '0',
	Last7Days = '7',
	Last28Days = '28',
	Last30Days = '30',
	Last90Days = '90',
}

export enum MetricName {
	Comments = 'commentsMetric',
	Downloads = 'downloadsMetric',
	Previews = 'previewsMetric',
	Views = 'viewsMetric',
	Undefined = 'undefinedMetric',
}

export enum AssetTypes {
	Document = 'document',
	WebContent = 'journal',
	Blog = 'blog',
	Undefined = 'undefined',
}

export enum MetricType {
	Comments = 'COMMENTS',
	Downloads = 'DOWNLOADS',
	Previews = 'PREVIEWS',
	Views = 'VIEWS',
	Undefined = 'UNDEFINED',
}

export enum Alignments {
	Center = 'center',
	Left = 'left',
	Right = 'right',
}

export enum Weights {
	Light = 'light',
	Normal = 'normal',
	Semibold = 'semibold',
	Bold = 'bold',
}

export type Column = {
	align?: Alignments;
	className?: string;
	color?: string;
	colspan?: number;
	label: string | (() => React.ReactNode);
	truncated?: boolean;
	weight?: Weights;
	width?: number;
};

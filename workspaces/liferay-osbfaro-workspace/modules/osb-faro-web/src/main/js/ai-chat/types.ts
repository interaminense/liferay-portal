/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export type ChartType = 'line' | 'bar' | 'area' | 'pie';

export interface ChartSpec {
	data: Array<Record<string, number | string>>;
	series: Array<{key: string; label?: string}>;
	title: string;
	type: ChartType;
	xKey: string;
}

export type Block =
	| {type: 'text'; text: string}
	| {type: 'tool_activity'; tool: string; status: string}
	| {type: 'chart'; spec: ChartSpec}
	| {type: 'error'; message: string; code?: string}
	| {type: 'done'};

/**
 * One bubble in the chat. Each streamed block becomes its own entry, so a single
 * assistant turn can produce several separate grey bubbles.
 */
export interface ChatEntry {
	block: Block;
	role: 'assistant' | 'user';
}

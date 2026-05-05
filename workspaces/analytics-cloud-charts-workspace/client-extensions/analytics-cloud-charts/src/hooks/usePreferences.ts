/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useCallback, useEffect, useRef, useState} from 'react';

import {RestErrorLike, restFetch} from '../lib/analytics';

const ENDPOINT = '/o/c/analyticscloudchartspreferenceses';

export type Metric =
	| ''
	| 'acquisitions'
	| 'audienceComposition'
	| 'devices'
	| 'pageEngagement'
	| 'pageOverview'
	| 'pagePath'
	| 'searchTerms'
	| 'siteOverview'
	| 'topPages'
	| 'trafficHeatmap'
	| 'visitFrequency';

export interface Preferences {
	aiInsightsEnabled?: boolean;
	channelId?: string;
	chartColors?: string[];
	metric?: Metric;
	rangeKey?: number;
}

interface PreferencesEntry {
	actions?: Record<string, unknown>;
	externalReferenceCode?: string;
	id?: number;
	instanceId?: string;
	preferences?: string | null;
}

export interface UsePreferencesResult {
	canEdit: boolean;
	error: Error | null;
	loading: boolean;
	preferences: Preferences;
	setupRequired: boolean;
	updatePreferences: (next: Partial<Preferences>) => Promise<void>;
}

const parsePreferencesField = (raw: string | null | undefined): Preferences => {
	if (!raw) {
		return {};
	}

	try {
		const parsed = JSON.parse(raw);

		return typeof parsed === 'object' && parsed !== null
			? (parsed as Preferences)
			: {};
	}
	catch {
		return {};
	}
};

export function usePreferences(instanceId: string): UsePreferencesResult {
	const [preferences, setPreferences] = useState<Preferences>({});
	const [canEdit, setCanEdit] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(true);
	const [setupRequired, setSetupRequired] = useState(false);

	const entryRef = useRef<PreferencesEntry | null>(null);

	useEffect(() => {
		if (!instanceId) {
			setLoading(false);

			return;
		}

		const controller = new AbortController();

		(async () => {
			try {
				const url = `${ENDPOINT}/by-external-reference-code/${encodeURIComponent(
					instanceId
				)}`;

				let entry: PreferencesEntry | null = null;
				let entryWasCreated = false;

				try {
					entry = await restFetch<PreferencesEntry>(url, {
						signal: controller.signal,
					});
				}
				catch (caught) {
					const restError = caught as RestErrorLike;

					// Endpoint missing → ObjectDefinition not deployed.
					// Surface as setupRequired (distinct from a real error)
					// so the UI can render setup instructions.
					if (restError?.endpointMissing) {
						setSetupRequired(true);

						return;
					}

					if (restError?.status !== 404) {
						throw caught;
					}

					try {
						entry = await restFetch<PreferencesEntry>(ENDPOINT, {
							body: JSON.stringify({
								externalReferenceCode: instanceId,
								instanceId,
								preferences: '{}',
							}),
							headers: {
								'Content-Type': 'application/json',
							},
							method: 'POST',
							signal: controller.signal,
						});

						entryWasCreated = true;
					}
					catch (postCaught) {
						const postRestError = postCaught as RestErrorLike;

						if (postRestError?.endpointMissing) {
							setSetupRequired(true);

							return;
						}

						throw postCaught;
					}
				}

				if (
					entryWasCreated &&
					entry?.id != null &&
					entry.actions?.update
				) {
					try {
						await restFetch(
							`${ENDPOINT}/${entry.id}/permissions?roleNames=Guest,User`,
							{
								body: JSON.stringify([
									{
										actionIds: ['VIEW'],
										roleName: 'Guest',
									},
									{
										actionIds: ['VIEW'],
										roleName: 'User',
									},
								]),
								headers: {
									'Content-Type': 'application/json',
								},
								method: 'PUT',
								signal: controller.signal,
							}
						);
					}
					catch (permissionError) {
						// Best-effort: non-admin won't be able to set
						// permissions, and the main flow still works for them.
						// eslint-disable-next-line no-console
						console.warn(
							'[analytics-cloud-charts] Could not grant Guest/User VIEW permission:',
							permissionError
						);
					}
				}

				if (entry) {
					entryRef.current = entry;
					setPreferences(parsePreferencesField(entry.preferences));
					setCanEdit(Boolean(entry.actions?.update));
				}
			}
			catch (caught) {
				if (caught instanceof Error && caught.name === 'AbortError') {
					return;
				}

				setError(
					caught instanceof Error
						? caught
						: new Error(String(caught))
				);
			}
			finally {
				setLoading(false);
			}
		})();

		return () => controller.abort();
	}, [instanceId]);

	const updatePreferences = useCallback(
		async (next: Partial<Preferences>) => {
			const previous = preferences;
			const merged = {...previous, ...next};

			setPreferences(merged);

			try {
				const url = `${ENDPOINT}/by-external-reference-code/${encodeURIComponent(
					instanceId
				)}`;

				const updated = await restFetch<PreferencesEntry>(url, {
					body: JSON.stringify({
						preferences: JSON.stringify(merged),
					}),
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'PATCH',
				});

				if (updated) {
					entryRef.current = updated;
					setPreferences(parsePreferencesField(updated.preferences));
					setCanEdit(Boolean(updated.actions?.update));
				}
			}
			catch (caught) {
				setPreferences(previous);

				setError(
					caught instanceof Error
						? caught
						: new Error(String(caught))
				);
			}
		},
		[instanceId, preferences]
	);

	return {
		canEdit,
		error,
		loading,
		preferences,
		setupRequired,
		updatePreferences,
	};
}

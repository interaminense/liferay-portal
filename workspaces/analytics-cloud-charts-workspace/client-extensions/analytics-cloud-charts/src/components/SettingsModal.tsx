/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {Modal as ClayModal, useModal} from '@clayui/modal';
import React, {useEffect, useState} from 'react';

import {useQuery} from '../hooks/useQuery';
import {Metric} from '../hooks/usePreferences';
import {TIME_RANGE_QUERY, TimeRange} from '../lib/analytics';
// TEMPORARY: dev-mode Anthropic key storage. Remove with anthropic-dev fallback.
import {
	getAnthropicApiKey,
	setAnthropicApiKey,
} from '../lib/anthropic-dev';
import {CHART_PALETTE} from '../lib/charts';
import {formatKey} from '../lib/format';
import {METRIC_INFO, METRIC_OPTIONS} from '../lib/metric-info';
import {ScopeBadge} from './ScopeBadge';

interface TimeRangeData {
	timeRange: TimeRange[];
}

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

const buildInitialColors = (initial: string[] | undefined) =>
	CHART_PALETTE.map((fallback, index) => {
		const candidate = initial?.[index];

		return candidate && HEX_REGEX.test(candidate) ? candidate : fallback;
	});

export interface SettingsModalIProps {
	initialAiInsightsEnabled?: boolean;
	initialChartColors?: string[];
	initialMetric: Metric;
	initialRangeKey?: number;
	onClose: () => void;
	onSave: (next: {
		aiInsightsEnabled: boolean;
		chartColors: string[] | undefined;
		metric: Metric;
		rangeKey: number | undefined;
	}) => void;
}

export const SettingsModal: React.FC<SettingsModalIProps> = ({
	initialAiInsightsEnabled,
	initialChartColors,
	initialMetric,
	initialRangeKey,
	onClose,
	onSave,
}) => {
	const {observer, onClose: closeModal} = useModal({onClose});

	const [metric, setMetric] = useState<Metric>(initialMetric);
	const [rangeKey, setRangeKey] = useState<number | undefined>(
		initialRangeKey
	);
	const [chartColors, setChartColors] = useState<string[]>(() =>
		buildInitialColors(initialChartColors)
	);
	const [aiInsightsEnabled, setAiInsightsEnabled] = useState<boolean>(
		!!initialAiInsightsEnabled
	);
	const [anthropicApiKey, setAnthropicApiKeyState] = useState<string>(() =>
		getAnthropicApiKey()
	);

	const {data, error, loading} = useQuery<TimeRangeData>(
		TIME_RANGE_QUERY,
		undefined,
		{fetchPolicy: 'cache-first'}
	);

	useEffect(() => {
		if (rangeKey == null && data?.timeRange?.length) {
			const fallback =
				data.timeRange.find((entry) => entry.default) ??
				data.timeRange[0];

			if (fallback?.rangeKey != null) {
				setRangeKey(fallback.rangeKey);
			}
		}
	}, [data, rangeKey]);

	const handleColorChange = (index: number, value: string) => {
		setChartColors((current) =>
			current.map((color, i) => (i === index ? value : color))
		);
	};

	const handleResetColors = () => {
		setChartColors([...CHART_PALETTE]);
	};

	const isDefaultPalette = chartColors.every(
		(color, index) => color === CHART_PALETTE[index]
	);

	const handleSave = () => {
		// TEMPORARY: persist Anthropic API key in browser localStorage only.
		// Removed when AI Hub becomes available.
		setAnthropicApiKey(anthropicApiKey);

		onSave({
			aiInsightsEnabled,
			chartColors: isDefaultPalette ? undefined : chartColors,
			metric,
			rangeKey,
		});
		closeModal();
	};

	return (
		<ClayModal observer={observer} size="lg">
			<ClayModal.Header>Analytics Cloud Charts Settings</ClayModal.Header>

			<ClayModal.Body>
				<div className="form-group">
					<label className="form-control-label">Metric</label>

					<div
						style={{
							display: 'grid',
							gap: 8,
							gridTemplateColumns:
								'repeat(auto-fill, minmax(220px, 1fr))',
							marginTop: 4,
						}}
					>
						{METRIC_OPTIONS.map((option) => {
							const isActive = metric === option;
							const info = METRIC_INFO[option];

							return (
								<div
									key={option}
									style={{
										background: isActive
											? 'rgba(75, 155, 255, 0.08)'
											: '#fff',
										border: `1px solid ${
											isActive ? '#4B9BFF' : '#e7e7ed'
										}`,
										borderRadius: 4,
										display: 'flex',
										flexDirection: 'column',
										transition:
											'background 120ms ease, border-color 120ms ease',
									}}
								>
									<button
										aria-pressed={isActive}
										onClick={() => setMetric(option)}
										style={{
											background: 'transparent',
											border: 0,
											cursor: 'pointer',
											padding: 12,
											textAlign: 'left',
											width: '100%',
										}}
										type="button"
									>
										<div
											style={{
												alignItems: 'center',
												display: 'flex',
												gap: 8,
												justifyContent: 'space-between',
											}}
										>
											<div
												className="font-weight-semi-bold"
												style={{
													color: isActive
														? '#0050C7'
														: '#272833',
													fontSize: 14,
												}}
											>
												{info.label}
											</div>

											<ScopeBadge scope={info.scope} />
										</div>

										<div
											className="text-secondary mt-1"
											style={{
												fontSize: 12,
												lineHeight: 1.4,
											}}
										>
											{info.description}
										</div>
									</button>
								</div>
							);
						})}
					</div>
				</div>

				<div className="form-group">
					<label
						className="d-flex align-items-start"
						style={{cursor: 'pointer', marginBottom: 0}}
					>
						<input
							checked={aiInsightsEnabled}
							onChange={(event) =>
								setAiInsightsEnabled(event.target.checked)
							}
							style={{
								flexShrink: 0,
								marginRight: 10,
								marginTop: 4,
							}}
							type="checkbox"
						/>

						<span>
							<span
								className="font-weight-semi-bold"
								style={{fontSize: 14}}
							>
								Auto-narrative insights
							</span>

							<div
								className="text-secondary mt-1"
								style={{fontSize: 12, lineHeight: 1.4}}
							>
								Show a short AI-generated summary below the
								chart explaining the most notable observation
								in the data. Currently powered by direct
								Anthropic API calls (development mode); will
								switch to Liferay AI Hub once the GCP project
								is provisioned.
							</div>
						</span>
					</label>
				</div>

				{/* TEMPORARY — Anthropic API key field. Remove when AI Hub is ready. */}
				{aiInsightsEnabled && (
					<div className="form-group">
						<label
							className="form-control-label"
							htmlFor="settings-anthropic-key"
						>
							Anthropic API key{' '}
							<span
								className="text-secondary"
								style={{
									fontSize: 11,
									fontWeight: 400,
								}}
							>
								(development only)
							</span>
						</label>

						<input
							autoComplete="off"
							className="form-control"
							id="settings-anthropic-key"
							onChange={(event) =>
								setAnthropicApiKeyState(event.target.value)
							}
							placeholder="sk-ant-..."
							type="password"
							value={anthropicApiKey}
						/>

						<div
							className="text-secondary mt-1"
							style={{fontSize: 11, lineHeight: 1.4}}
						>
							Stored in your browser&apos;s localStorage only.
							Never sent to Liferay. This field will be removed
							once the Liferay AI Hub project is available.
						</div>
					</div>
				)}

				<div className="form-group">
					<label
						className="form-control-label"
						htmlFor="settings-range-key"
					>
						Time Range
					</label>

					{loading && (
						<span
							aria-label="Loading time ranges"
							className="loading-animation loading-animation-sm"
						/>
					)}

					{error && (
						<div className="alert alert-danger" role="alert">
							{error.message}
						</div>
					)}

					{data?.timeRange?.length ? (
						<select
							className="form-control"
							id="settings-range-key"
							onChange={(event) =>
								setRangeKey(
									Number.parseInt(event.target.value, 10)
								)
							}
							value={rangeKey ?? ''}
						>
							{data.timeRange.map((entry) => (
								<option
									key={entry.key ?? ''}
									value={entry.rangeKey ?? ''}
								>
									{formatKey(entry.key)}
								</option>
							))}
						</select>
					) : null}
				</div>

				<div className="form-group">
					<label className="form-control-label">Chart Colors</label>

					<div
						className="d-flex flex-wrap"
						style={{gap: 12, marginTop: 4}}
					>
						{chartColors.map((color, index) => (
							<div
								className="d-flex flex-column align-items-center"
								key={index}
							>
								<input
									aria-label={`Chart color ${index + 1}`}
									onChange={(event) =>
										handleColorChange(
											index,
											event.target.value
										)
									}
									style={{
										border: '1px solid #cdced9',
										borderRadius: 4,
										cursor: 'pointer',
										height: 36,
										padding: 2,
										width: 44,
									}}
									type="color"
									value={color}
								/>

								<small className="text-secondary mt-1">
									{index + 1}
								</small>
							</div>
						))}
					</div>

					{!isDefaultPalette && (
						<button
							className="btn btn-link btn-sm p-0 mt-2"
							onClick={handleResetColors}
							type="button"
						>
							Reset to defaults
						</button>
					)}
				</div>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							displayType="secondary"
							onClick={closeModal}
						>
							Cancel
						</ClayButton>

						<ClayButton onClick={handleSave}>Save</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	);
};

export default SettingsModal;

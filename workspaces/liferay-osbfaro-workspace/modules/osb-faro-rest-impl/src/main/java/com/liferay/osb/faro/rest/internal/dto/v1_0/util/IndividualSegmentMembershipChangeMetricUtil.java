/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.faro.rest.internal.dto.v1_0.util;

import com.liferay.osb.faro.engine.client.model.IndividualSegmentMembershipChangeAggregation;
import com.liferay.osb.faro.rest.dto.v1_0.HistogramBucket;
import com.liferay.osb.faro.rest.dto.v1_0.IndividualSegmentMembershipChangeMetric;
import com.liferay.osb.faro.rest.dto.v1_0.Metric;

import java.time.format.DateTimeFormatter;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.function.ToLongFunction;

/**
 * @author Leslie Wong
 */
public class IndividualSegmentMembershipChangeMetricUtil {

	public static IndividualSegmentMembershipChangeMetric
		toIndividualSegmentMembershipChangeMetric(
			List<IndividualSegmentMembershipChangeAggregation>
				individualSegmentMembershipChangeAggregations,
			int days) {

		List<IndividualSegmentMembershipChangeAggregation> sorted =
			new ArrayList<>();

		for (IndividualSegmentMembershipChangeAggregation
				individualSegmentMembershipChangeAggregation :
					individualSegmentMembershipChangeAggregations) {

			Date intervalInitDate =
				individualSegmentMembershipChangeAggregation.
					getIntervalInitDate();

			if (intervalInitDate != null) {
				sorted.add(individualSegmentMembershipChangeAggregation);
			}
		}

		sorted.sort(
			Comparator.comparing(
				IndividualSegmentMembershipChangeAggregation::
					getIntervalInitDate));

		int fromIndex = Math.max(0, sorted.size() - days);

		List<IndividualSegmentMembershipChangeAggregation> currentAggregations =
			sorted.subList(fromIndex, sorted.size());
		List<IndividualSegmentMembershipChangeAggregation>
			previousAggregations = sorted.subList(0, fromIndex);

		return new IndividualSegmentMembershipChangeMetric() {
			{
				setAddedIndividuals(
					() -> _toSumMetric(
						currentAggregations, previousAggregations,
						IndividualSegmentMembershipChangeAggregation::
							getAddedIndividualsCount));
				setIndividuals(
					() -> _toLatestValueMetric(
						currentAggregations, previousAggregations,
						IndividualSegmentMembershipChangeAggregation::
							getIndividualsCount));
				setKnownIndividuals(
					() -> _toLatestValueMetric(
						currentAggregations, previousAggregations,
						IndividualSegmentMembershipChangeAggregation::
							getKnownIndividualsCount));
				setRemovedIndividuals(
					() -> _toSumMetric(
						currentAggregations, previousAggregations,
						IndividualSegmentMembershipChangeAggregation::
							getRemovedIndividualsCount));
			}
		};
	}

	private static Double _getLatestValue(
		List<IndividualSegmentMembershipChangeAggregation>
			individualSegmentMembershipChangeAggregations,
		ToLongFunction<IndividualSegmentMembershipChangeAggregation>
			toLongFunction) {

		if (individualSegmentMembershipChangeAggregations.isEmpty()) {
			return null;
		}

		IndividualSegmentMembershipChangeAggregation
			individualSegmentMembershipChangeAggregation =
				individualSegmentMembershipChangeAggregations.get(
					individualSegmentMembershipChangeAggregations.size() - 1);

		return (double)toLongFunction.applyAsLong(
			individualSegmentMembershipChangeAggregation);
	}

	private static Double _getSum(
		List<IndividualSegmentMembershipChangeAggregation>
			individualSegmentMembershipChangeAggregations,
		ToLongFunction<IndividualSegmentMembershipChangeAggregation>
			toLongFunction) {

		if (individualSegmentMembershipChangeAggregations.isEmpty()) {
			return null;
		}

		long sum = 0;

		for (IndividualSegmentMembershipChangeAggregation
				individualSegmentMembershipChangeAggregation :
					individualSegmentMembershipChangeAggregations) {

			sum += toLongFunction.applyAsLong(
				individualSegmentMembershipChangeAggregation);
		}

		return (double)sum;
	}

	private static String _getTrendClassification(
		Double previousMetricValue, Double metricValue) {

		if ((previousMetricValue == null) || (metricValue == null)) {
			return null;
		}

		int compare = metricValue.compareTo(previousMetricValue);

		if (compare > 0) {
			return "POSITIVE";
		}

		if (compare < 0) {
			return "NEGATIVE";
		}

		return "NEUTRAL";
	}

	private static Double _getTrendPercentage(
		Double previousMetricValue, Double metricValue) {

		if ((previousMetricValue == null) || (metricValue == null) ||
			(previousMetricValue == 0)) {

			return null;
		}

		return ((metricValue - previousMetricValue) / previousMetricValue) *
			100;
	}

	private static HistogramBucket[] _toHistogramBuckets(
		List<IndividualSegmentMembershipChangeAggregation>
			individualSegmentMembershipChangeAggregations,
		ToLongFunction<IndividualSegmentMembershipChangeAggregation>
			toLongFunction) {

		List<HistogramBucket> histogramBuckets = new ArrayList<>();

		for (IndividualSegmentMembershipChangeAggregation
				individualSegmentMembershipChangeAggregation :
					individualSegmentMembershipChangeAggregations) {

			Date intervalInitDate =
				individualSegmentMembershipChangeAggregation.
					getIntervalInitDate();

			histogramBuckets.add(
				new HistogramBucket() {
					{
						setKey(
							() -> DateTimeFormatter.ISO_INSTANT.format(
								intervalInitDate.toInstant()));
						setValue(
							() -> (double)toLongFunction.applyAsLong(
								individualSegmentMembershipChangeAggregation));
					}
				});
		}

		return histogramBuckets.toArray(new HistogramBucket[0]);
	}

	private static Metric _toLatestValueMetric(
		List<IndividualSegmentMembershipChangeAggregation> currentAggregations,
		List<IndividualSegmentMembershipChangeAggregation> previousAggregations,
		ToLongFunction<IndividualSegmentMembershipChangeAggregation>
			toLongFunction) {

		return _toMetric(
			currentAggregations,
			_getLatestValue(previousAggregations, toLongFunction),
			toLongFunction,
			_getLatestValue(currentAggregations, toLongFunction));
	}

	private static Metric _toMetric(
		List<IndividualSegmentMembershipChangeAggregation> currentAggregations,
		Double previousMetricValue,
		ToLongFunction<IndividualSegmentMembershipChangeAggregation>
			toLongFunction,
		Double metricValue) {

		return new Metric() {
			{
				setHistogramBuckets(
					() -> _toHistogramBuckets(
						currentAggregations, toLongFunction));
				setPreviousValue(() -> previousMetricValue);
				setTrendClassification(
					() -> _getTrendClassification(
						previousMetricValue, metricValue));
				setTrendPercentage(
					() -> _getTrendPercentage(
						previousMetricValue, metricValue));
				setValue(() -> metricValue);
			}
		};
	}

	private static Metric _toSumMetric(
		List<IndividualSegmentMembershipChangeAggregation> currentAggregations,
		List<IndividualSegmentMembershipChangeAggregation> previousAggregations,
		ToLongFunction<IndividualSegmentMembershipChangeAggregation>
			toLongFunction) {

		return _toMetric(
			currentAggregations, _getSum(previousAggregations, toLongFunction),
			toLongFunction, _getSum(currentAggregations, toLongFunction));
	}

}
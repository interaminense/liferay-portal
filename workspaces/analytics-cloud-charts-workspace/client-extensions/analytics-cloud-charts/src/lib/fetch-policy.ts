/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {FetchPolicy} from '../hooks/useQuery';
import {RangeSelectors} from './types';

/**
 * rangeKeys whose data is volatile within a session and should always
 * hit the network (no cache reuse). 0 corresponds to "Today" / "Last 24h"
 * in the AC time range catalog.
 */
const LIVE_RANGE_KEYS = new Set<number>([0]);

export function fetchPolicyForRange(
	rangeSelectors: RangeSelectors | undefined
): FetchPolicy {
	if (
		rangeSelectors?.rangeKey != null &&
		LIVE_RANGE_KEYS.has(rangeSelectors.rangeKey)
	) {
		return 'network-only';
	}

	return 'cache-first';
}

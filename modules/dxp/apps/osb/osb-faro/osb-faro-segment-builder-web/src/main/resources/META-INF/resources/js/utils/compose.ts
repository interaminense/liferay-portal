/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

type AnyFunction = (...args: any[]) => any;

export function compose<T>(...fns: AnyFunction[]): (input: any) => T {
	if (!fns.length) {
		return (x: unknown) => x as unknown as T;
	}

	return (x: unknown): T =>
		fns.reduceRight<unknown>((acc, fn) => fn(acc), x) as T;
}

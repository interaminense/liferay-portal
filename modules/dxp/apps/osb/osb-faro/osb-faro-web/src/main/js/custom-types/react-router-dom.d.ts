/**
 * `useParams` augmentation: keep the v5-style generic shape `<{ key: string }>`
 * because callers across the module rely on it. v7 ships a stricter signature
 * (`<ParamKey extends string>` returning `Partial<Record<...>>`); the override
 * below preserves the previous contract until call sites migrate to defensive
 * defaults like `useParams<{ groupId?: string }>()`.
 *
 * This file must be a module (not a script) for `declare module` to AUGMENT
 * rather than REPLACE the react-router-dom typings. Hence the no-op import.
 */

import 'react-router-dom';

declare module 'react-router-dom' {
	export function useParams<
		Params extends Record<string, string | undefined> = Record<
			string,
			string | undefined
		>
	>(): Params;
}

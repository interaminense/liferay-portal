/**
 * Side-effect import: registers every Clay flag SVG with the bundle's
 * svg-sprite-loader so each `flags-<locale>` symbol becomes available
 * through `<ClayIcon symbol="flags-...">`. Import this module once from any
 * UI surface that renders language flags.
 */
const flagsContext = (
	require as {
		context: (
			dir: string,
			recursive: boolean,
			regExp: RegExp
		) => {keys(): string[]; (id: string): unknown};
	}
).context('@clayui/css/src/images/icons', false, /^\.\/flags-[a-zA-Z-]+\.svg$/);

flagsContext.keys().forEach(flagsContext);

export {};

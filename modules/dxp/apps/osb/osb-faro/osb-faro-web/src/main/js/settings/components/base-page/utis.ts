export function updateSearchParams(navigate, key: string, value: any) {
	const params = new URLSearchParams(window.location.search);
	params.set(key, String(value));

	navigate({
		pathname: window.location.pathname,
		search: params.toString()
	});
}

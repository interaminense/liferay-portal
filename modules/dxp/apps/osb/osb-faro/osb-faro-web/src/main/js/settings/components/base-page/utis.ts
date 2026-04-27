import {useNavigate} from 'react-router-dom';

type Navigate = ReturnType<typeof useNavigate>;

export function updateSearchParams(
	navigate: Navigate,
	key: string,
	value: any
) {
	const params = new URLSearchParams(window.location.search);
	params.set(key, String(value));

	navigate({
		pathname: window.location.pathname,
		search: params.toString()
	});
}

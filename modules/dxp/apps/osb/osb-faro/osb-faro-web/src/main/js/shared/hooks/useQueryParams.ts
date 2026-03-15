import {getSafeDecodedURIComponent} from 'shared/util/util';
import {useLocation} from 'react-router';

function decodeQueryParam(param) {
	return getSafeDecodedURIComponent(param.replace(/\+/g, ' '));
}

function queryStringToObject(initialQueryString: string): any {
	if (!initialQueryString) return {};

	const queryString = initialQueryString.replace('?', '');

	const params = queryString.split('&');
	const query = {};

	params.forEach(param => {
		const [key, value] = param.split('=');
		query[key] = decodeQueryParam(value);
	});

	return query;
}

// TODO: Remove this once we upgrade to react-router v6
export function useQueryParams() {
	const {search} = useLocation();

	return queryStringToObject(search);
}

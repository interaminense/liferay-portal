import {useLocation} from 'react-router-dom';

// TODO: Remove this once we upgrade to react-router-dom v6
export const useQueryParams = () => {
	const {search} = useLocation();
	const params = new URLSearchParams(search);

	const queryParams: {[key: string]: string} = {};

	params.forEach((value, key) => {
		queryParams[key] = value;
	});

	return queryParams;
};

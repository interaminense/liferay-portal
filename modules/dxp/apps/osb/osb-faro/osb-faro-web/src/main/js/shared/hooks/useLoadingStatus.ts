import {useEffect, useState} from 'react';

export function useLoadingStatus() {
	const [loadingCount, setLoadingCount] = useState(0);

	useEffect(() => {
		const checkLoadingStatus = () => {
			const loadingElements = document.querySelectorAll('.loading-root');

			setLoadingCount(loadingElements.length);
		};

		checkLoadingStatus();

		const observer = new MutationObserver(checkLoadingStatus);

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	return loadingCount > 0;
}

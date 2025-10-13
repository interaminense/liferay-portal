import {useCallback, useEffect, useRef, useState} from 'react';

export function usePolling(requestFn, stopConditionFn, interval = 3000) {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [isRunning, setIsRunning] = useState(false);

	const timeoutRef = useRef(null);
	const isMounted = useRef(false);

	const poll = useCallback(async () => {
		try {
			const result = await requestFn();

			if (!isMounted.current) return;

			setData(result);

			if (stopConditionFn(result)) {
				setIsRunning(false);
				return;
			}

			timeoutRef.current = setTimeout(poll, interval);
		} catch (err) {
			if (isMounted.current) {
				setError(err);
				setIsRunning(false);
			}
		}
	}, [requestFn, stopConditionFn, interval]);

	useEffect(() => {
		isMounted.current = true;
		setIsRunning(true);
		poll();

		return () => {
			isMounted.current = false;
			clearTimeout(timeoutRef.current);
		};
	}, [poll]);

	return {data, error, isRunning};
}

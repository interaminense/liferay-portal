import {close, modalTypes, open} from 'shared/actions/modals';
import {useBlocker} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {useEffect} from 'react';

/**
 * Unsaved-changes navigation prompt.
 *
 * Replaces the v5 `<Prompt>` + `getUserConfirmation` flow. Requires the app to
 * be mounted under a v7 data router (`createBrowserRouter` + `<RouterProvider>`)
 * — `useBlocker` does not work in a declarative `<BrowserRouter>`.
 */
export function useUnsavedChangesPrompt(when: boolean, message?: string): void {
	const dispatch = useDispatch();

	const blocker = useBlocker(
		({currentLocation, nextLocation}) =>
			when && currentLocation.pathname !== nextLocation.pathname
	);

	useEffect(() => {
		if (blocker.state !== 'blocked') {
			return;
		}

		dispatch(
			open(modalTypes.CONFIRMATION_MODAL, {
				cancelMessage: Liferay.Language.get('stay-on-page'),
				message:
					message ??
					Liferay.Language.get(
						'you-have-unsaved-changes-that-will-be-discarded-by-navigating-away-from-this-page.-do-you-want-to-leave-and-discard-your-changes'
					),
				modalVariant: 'modal-warning',
				onClose: () => {
					blocker.reset?.();
					dispatch(close());
				},
				onSubmit: () => {
					blocker.proceed?.();
				},
				submitButtonDisplay: 'warning',
				submitMessage: Liferay.Language.get('leave-page'),
				title: Liferay.Language.get('unsaved-changes'),
				titleIcon: 'warning-full'
			})
		);
	}, [blocker.state, dispatch, message]);
}

export default useUnsavedChangesPrompt;

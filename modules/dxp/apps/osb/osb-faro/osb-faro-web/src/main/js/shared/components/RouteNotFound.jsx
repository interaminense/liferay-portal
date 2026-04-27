import ErrorPage from 'shared/pages/ErrorPage';
import React from 'react';

/**
 * Renders the 404 ErrorPage in place when no parent route matched.
 *
 * The v5 implementation went through a `<Redirect to={{state: {notFoundError: true}}} />`
 * dance that bubbled the 404 up to RoutesContainer via location state. v7's
 * `<Navigate>` triggers an immediate re-render that can race with sibling
 * useEffect-based redirects (e.g. CheckValidChannel) and prevent them from
 * firing. Rendering ErrorPage directly avoids the race; if a sibling effect
 * later issues a real navigation, the user will only see ErrorPage briefly
 * before the new route renders.
 */
export default () => <ErrorPage />;

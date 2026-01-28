import React from 'react';
import {Navigate} from 'react-router';

/**
 * Component for triggering a redirect to the same page
 * with some extra state for App to decide whether to render a 404 or children.
 */
export default () => <Navigate replace state={{notFoundError: true}} to='/' />;

import cache from './cache';
import {ApolloClient, ApolloLink, from, HttpLink} from '@apollo/client';
import {get} from 'lodash';
import {LocalState} from '@apollo/client/local-state';
import {onError} from '@apollo/client/link/error';
import {reloadPage} from 'shared/util/router';
import {resolvers} from './resolvers/resolvers';

const groupIdRegex = /^\/workspace\/([a-z0-9._-]+)/;

const groupIdLink = new ApolloLink((operation, forward) => {
	const currentUri = new URL(window.location.href);
	const matches = currentUri.pathname.match(groupIdRegex);

	const {operationName} = operation;

	let uri = '/o/cerebro/graphql';

	if (matches && matches.length > 1) {
		const groupId = matches[1];
		uri = `${uri}?opname=${operationName}&projectGroupId=${groupId}`;
	} else {
		uri = `${uri}?opname=${operationName}`;
	}

	operation.setContext(
		({headers = {}}: {headers?: Record<string, string>}) => ({
			headers,
			uri
		})
	);

	return forward(operation);
});

const errorLink = onError(({operation}) => {
	const status = get(operation.getContext(), ['response', 'status']) as
		| number
		| undefined;

	if (status === 401) {
		reloadPage();
	}
});

const httpLink = new HttpLink({
	credentials: 'same-origin'
});

const client = new ApolloClient({
	cache,
	defaultOptions: {
		watchQuery: {
			notifyOnNetworkStatusChange: true
		}
	},
	link: from([errorLink, groupIdLink, httpLink]),

	// TODO: Migrate resolvers to the new apollo v4

	localState: new LocalState({
		resolvers
	})
});

export default client;

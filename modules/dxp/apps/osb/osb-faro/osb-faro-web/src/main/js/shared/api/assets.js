import sendRequest from 'shared/util/request';

export function search({groupId, ...data}) {
	return sendRequest({
		data,
		method: 'GET',
		path: `contacts/${groupId}/asset`
	});
}

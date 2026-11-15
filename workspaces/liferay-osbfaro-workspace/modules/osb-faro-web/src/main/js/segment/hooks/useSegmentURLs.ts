import {createContext, useContext} from 'react';
import {Routes, SEGMENTS, setUriQueryValues, toRoute} from 'shared/util/router';
import {useParams} from 'react-router-dom';

interface ISegmentURLsContext {
	editSegmentURL: string;
	segmentURL: string;
	segmentsURL: string;
}

export interface ISegmentURLs {
	getEditSegmentURL: (segmentId?: string) => string;
	getSegmentURL: (segmentId: string) => string;
	segmentsURL: string;
}

export const SegmentURLsContext = createContext<ISegmentURLsContext | null>(
	null
);

export function useSegmentURLs(): ISegmentURLs {
	const {channelId, groupId} = useParams();

	const segmentURLsContext = useContext(SegmentURLsContext);

	if (segmentURLsContext) {
		const {editSegmentURL, segmentURL, segmentsURL} = segmentURLsContext;

		return {
			getEditSegmentURL: (segmentId) =>
				segmentId
					? setUriQueryValues({segmentId}, editSegmentURL)
					: editSegmentURL,
			getSegmentURL: (segmentId) =>
				setUriQueryValues({segmentId}, segmentURL),
			segmentsURL,
		};
	}

	return {
		getEditSegmentURL: (segmentId) =>
			segmentId
				? toRoute(Routes.CONTACTS_SEGMENT_EDIT, {
						channelId,
						groupId,
						id: segmentId,
					})
				: toRoute(Routes.CONTACTS_SEGMENT_CREATE, {channelId, groupId}),
		getSegmentURL: (segmentId) =>
			toRoute(Routes.CONTACTS_SEGMENT, {
				channelId,
				groupId,
				id: segmentId,
			}),
		segmentsURL: toRoute(Routes.CONTACTS_LIST_ENTITY, {
			channelId,
			groupId,
			type: SEGMENTS,
		}),
	};
}

/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export namespace Analytics {
	export enum ApplicationId {
		Blog = 'Blog',
		Custom = 'Custom',
		CustomEvent = 'CustomEvent',
		Document = 'Document',
		Form = 'Form',
		Page = 'Page',
		WebContent = 'WebContent',
	}

	export enum EventId {
		AssetClicked = 'assetClicked',
		AssetDepthReached = 'assetDepthReached',
		AssetDownloaded = 'assetDownloaded',
		AssetSubmitted = 'assetSubmitted',
		AssetViewed = 'assetViewed',
		BlogClicked = 'blogClicked',
		BlogDepthReached = 'blogDepthReached',
		BlogImpressionMade = 'blogImpressionMade',
		BlogViewed = 'blogViewed',
		DocumentDownloaded = 'documentDownloaded',
		DocumentImpressionMade = 'documentImpressionMade',
		DocumentPreviewed = 'documentPreviewed',
		FieldBlurred = 'fieldBlurred',
		FieldFocused = 'fieldFocused',
		FormSubmitted = 'formSubmitted',
		FormViewed = 'formViewed',
		PageDepthReached = 'pageDepthReached',
		PageLoaded = 'pageLoaded',
		PageRead = 'pageRead',
		PageUnloaded = 'pageUnloaded',
		TabBlurred = 'tabBlurred',
		TabFocused = 'tabFocused',
		WebContentClicked = 'webContentClicked',
		WebContentImpressionMade = 'webContentImpressionMade',
		WebContentViewed = 'webContentViewed',
	}

	export type Config = {
		channelId: string;
		dataSourceId: string;
		endpointUrl: string;
		flushInterval: number;
		identity: {
			emailAddressHashed: string;
		};
		identityEndpoint: string;
		projectId: string;
		userId: string;
	};

	export enum ElementAction {
		View = 'view',
		Impression = 'impression',
		Download = 'download',
	}

	export enum ElementType {
		Blog = 'blog',
		BlogsEntry = 'com.liferay.blogs.model.BlogsEntry',
		Custom = 'custom',
		Document = 'document',
		FileEntry = 'com.liferay.portal.kernel.repository.model.FileEntry',
		JournalArticle = 'com.liferay.journal.model.JournalArticle',
		WebContent = 'web-content',
	}

	export interface HTMLElement extends Element {
		dataset: {
			analyticsAssetAction?: Analytics.ElementAction;
			analyticsAssetCategory?: string;
			analyticsAssetId: string;
			analyticsAssetSubtype?: string;
			analyticsAssetTitle?: string;
			analyticsAssetType?: Analytics.ElementType;
			analyticsAssetVersion?: string;
			analyticsWebContentResourcePk?: string;
		};
		innerText: string;
	}

	export type Event = {
		applicationId: Analytics.ApplicationId;
		contextHash: string;
		eventDate: string;
		eventId: Analytics.EventId;
		eventLocalDate: string;
		properties: Analytics.EventProps;
	};

	export type EventProps = {
		[key: string]: boolean | number | string;
	} & {
		assetType?: Analytics.ApplicationId;
	};

	export type Identity = {
		channelId: string;
		dataSourceId: string;
		emailAddressHashed: string;
		id: string;
		userId: string;
	};

	export type Context = {
		channelId: string;
		dataSourceId: string;
		[key: string]: string | number | boolean;
	};

	export type Message = {
		channelId: string;
		context: {
			[key: string]: string;
		};
		dataSourceId: string;
		emailAddressHashed: string;
		events: Event[];
		id: string;
		userId: string;
	};

	export type Middleware = {
		[key: string]: Function;
	};

	export enum StorageKeys {
		ChannelId = 'ac_client_channel_id',
		Contexts = 'ac_client_context',
		Events = 'ac_client_batch',
		Identity = 'ac_client_identity',
		IdentityMessage = 'ac_message_queue_identity',
		Messages = 'ac_message_queue',
		PrevEmailAddressHash = 'ac_client_previous_email_address_hash',
		StorageVersion = 'ac_client_storage_version',
		UserId = 'ac_client_user_id',
	}

	export type FlushResult = {value: {events: Analytics.Event[]}};
}

import {Catalog} from '@liferay/osb-faro-segment-builder-web';

/**
 * Browser-session catalog for client-side personalization demos, organized
 * along the seven dimensions most major platforms (Optimizely, Adobe
 * Target, Segment, VWO) expose:
 *
 *  1. Technology  — the visitor's stack (browser, OS, connection,
 *     cookies/JS support).
 *  2. Device      — the physical characteristics (type, screen, viewport,
 *     touch).
 *  3. Geolocation — where the visitor is (country, region, city, timezone).
 *  4. Page        — the page they are on right now (URL parts, title, type).
 *  5. Navigation  — how they arrived (referrer, UTM parameters, entry/prev
 *     page).
 *  6. Session     — running counters for the current session (page views,
 *     duration, returning visitor, total sessions, auth state).
 *  7. Time        — when the request is happening (current hour, day of
 *     week, weekend, business hours).
 *
 * The catalog only describes the criteria. A real client-side
 * personalization consumer wires each `propertyName` to its runtime
 * evaluator — `navigator.userAgent`, `screen.width`, `location.pathname`,
 * `Intl.DateTimeFormat().resolvedOptions().timeZone`, a sessionStorage
 * counter, an IP-geolocation lookup, etc.
 */
export const sessionCatalog: Catalog = {
	sections: [
		{
			key: 'technology',
			label: 'Technology',
			subgroups: [
				{
					items: [
						{
							defaultValue: 'chrome',
							icon: 'desktop',
							label: 'Browser',
							name: 'technology.browser',
							options: [
								{label: 'Chrome', value: 'chrome'},
								{label: 'Firefox', value: 'firefox'},
								{label: 'Safari', value: 'safari'},
								{label: 'Edge', value: 'edge'},
								{label: 'Opera', value: 'opera'},
								{label: 'Other', value: 'other'}
							],
							type: 'select'
						},
						{
							defaultValue: '',
							icon: 'text',
							label: 'Browser Version',
							name: 'technology.browserVersion',
							type: 'text'
						},
						{
							defaultValue: 'windows',
							icon: 'cog',
							label: 'Operating System',
							name: 'technology.os',
							options: [
								{label: 'Windows', value: 'windows'},
								{label: 'macOS', value: 'macos'},
								{label: 'Linux', value: 'linux'},
								{label: 'iOS', value: 'ios'},
								{label: 'Android', value: 'android'},
								{label: 'Chrome OS', value: 'chromeos'},
								{label: 'Other', value: 'other'}
							],
							type: 'select'
						},
						{
							defaultValue: '',
							icon: 'text',
							label: 'OS Version',
							name: 'technology.osVersion',
							type: 'text'
						},
						{
							defaultValue: 'wifi',
							icon: 'cog',
							label: 'Connection Type',
							name: 'technology.connectionType',
							options: [
								{label: 'WiFi', value: 'wifi'},
								{label: 'Cellular', value: 'cellular'},
								{label: 'Ethernet', value: 'ethernet'},
								{label: '2G', value: '2g'},
								{label: '3G', value: '3g'},
								{label: '4G', value: '4g'},
								{label: '5G', value: '5g'},
								{label: 'Unknown', value: 'unknown'}
							],
							type: 'select'
						},
						{
							defaultValue: 'true',
							icon: 'check',
							label: 'Cookies Enabled',
							name: 'technology.cookiesEnabled',
							type: 'boolean'
						},
						{
							defaultValue: 'true',
							icon: 'check',
							label: 'JavaScript Enabled',
							name: 'technology.javascriptEnabled',
							type: 'boolean'
						}
					]
				}
			]
		},
		{
			key: 'device',
			label: 'Device',
			subgroups: [
				{
					items: [
						{
							defaultValue: 'desktop',
							icon: 'monitor',
							label: 'Device Type',
							name: 'device.type',
							options: [
								{label: 'Desktop', value: 'desktop'},
								{label: 'Tablet', value: 'tablet'},
								{label: 'Mobile', value: 'mobile'},
								{label: 'TV', value: 'tv'},
								{label: 'Wearable', value: 'wearable'}
							],
							type: 'select'
						},
						{
							defaultValue: 'false',
							icon: 'check',
							label: 'Touch Enabled',
							name: 'device.touchEnabled',
							type: 'boolean'
						},
						{
							defaultValue: 0,
							icon: 'integer',
							label: 'Screen Width (px)',
							name: 'device.screenWidth',
							type: 'number'
						},
						{
							defaultValue: 0,
							icon: 'integer',
							label: 'Screen Height (px)',
							name: 'device.screenHeight',
							type: 'number'
						},
						{
							defaultValue: 0,
							icon: 'integer',
							label: 'Viewport Width (px)',
							name: 'device.viewportWidth',
							type: 'number'
						},
						{
							defaultValue: 0,
							icon: 'integer',
							label: 'Viewport Height (px)',
							name: 'device.viewportHeight',
							type: 'number'
						},
						{
							defaultValue: 1,
							icon: 'integer',
							label: 'Pixel Ratio',
							name: 'device.pixelRatio',
							type: 'number'
						},
						{
							defaultValue: 'portrait',
							icon: 'cog',
							label: 'Orientation',
							name: 'device.orientation',
							options: [
								{label: 'Portrait', value: 'portrait'},
								{label: 'Landscape', value: 'landscape'}
							],
							type: 'select'
						}
					]
				}
			]
		},
		{
			key: 'geolocation',
			label: 'Geolocation',
			subgroups: [
				{
					items: [
						{
							defaultValue: '',
							icon: 'globe',
							label: 'Country',
							name: 'geolocation.country',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'globe',
							label: 'Country Code (ISO)',
							name: 'geolocation.countryCode',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'globe',
							label: 'Region / State',
							name: 'geolocation.region',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'globe',
							label: 'City',
							name: 'geolocation.city',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'text',
							label: 'Postal Code',
							name: 'geolocation.postalCode',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'text',
							label: 'Timezone (IANA)',
							name: 'geolocation.timezone',
							type: 'text'
						},
						{
							defaultValue: 0,
							icon: 'time',
							label: 'Timezone Offset (minutes)',
							name: 'geolocation.timezoneOffset',
							type: 'number'
						},
						{
							defaultValue: 'en',
							icon: 'globe',
							label: 'Browser Language',
							name: 'geolocation.language',
							options: [
								{label: 'English', value: 'en'},
								{label: 'Portuguese', value: 'pt'},
								{label: 'Spanish', value: 'es'},
								{label: 'French', value: 'fr'},
								{label: 'German', value: 'de'},
								{label: 'Italian', value: 'it'},
								{label: 'Japanese', value: 'ja'},
								{label: 'Chinese', value: 'zh'}
							],
							type: 'select'
						}
					]
				}
			]
		},
		{
			key: 'page',
			label: 'Page',
			subgroups: [
				{
					items: [
						{
							defaultValue: '',
							icon: 'globe',
							label: 'Page URL',
							name: 'page.url',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'globe',
							label: 'Page Path',
							name: 'page.path',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'globe',
							label: 'Hostname',
							name: 'page.hostname',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'text',
							label: 'Page Title',
							name: 'page.title',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'text',
							label: 'Query String',
							name: 'page.queryString',
							type: 'text'
						},
						{
							defaultValue: 'other',
							icon: 'cog',
							label: 'Page Type',
							name: 'page.type',
							options: [
								{label: 'Home', value: 'home'},
								{label: 'Category', value: 'category'},
								{label: 'Product', value: 'product'},
								{label: 'Article / Blog', value: 'article'},
								{label: 'Search Results', value: 'search'},
								{label: 'Cart', value: 'cart'},
								{label: 'Checkout', value: 'checkout'},
								{label: 'Account', value: 'account'},
								{label: 'Other', value: 'other'}
							],
							type: 'select'
						},
						{
							defaultValue: 0,
							icon: 'integer',
							label: 'Path Depth',
							name: 'page.pathDepth',
							type: 'number'
						}
					]
				}
			]
		},
		{
			key: 'navigation',
			label: 'Navigation',
			subgroups: [
				{
					items: [
						{
							defaultValue: '',
							icon: 'reply',
							label: 'Referrer URL',
							name: 'navigation.referrer',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'reply',
							label: 'Referrer Domain',
							name: 'navigation.referrerDomain',
							type: 'text'
						},
						{
							defaultValue: 'direct',
							icon: 'cog',
							label: 'Traffic Source',
							name: 'navigation.trafficSource',
							options: [
								{label: 'Direct', value: 'direct'},
								{label: 'Organic Search', value: 'organic'},
								{label: 'Paid Search', value: 'paid'},
								{label: 'Social', value: 'social'},
								{label: 'Email', value: 'email'},
								{label: 'Referral', value: 'referral'},
								{label: 'Display Ad', value: 'display'},
								{label: 'Other', value: 'other'}
							],
							type: 'select'
						},
						{
							defaultValue: '',
							icon: 'text',
							label: 'UTM Source',
							name: 'navigation.utmSource',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'text',
							label: 'UTM Medium',
							name: 'navigation.utmMedium',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'text',
							label: 'UTM Campaign',
							name: 'navigation.utmCampaign',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'text',
							label: 'UTM Content',
							name: 'navigation.utmContent',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'text',
							label: 'UTM Term',
							name: 'navigation.utmTerm',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'globe',
							label: 'Entry Page',
							name: 'navigation.entryPage',
							type: 'text'
						},
						{
							defaultValue: '',
							icon: 'globe',
							label: 'Previous Page',
							name: 'navigation.previousPage',
							type: 'text'
						}
					]
				}
			]
		},
		{
			key: 'session',
			label: 'Session',
			subgroups: [
				{
					items: [
						{
							defaultValue: 'false',
							icon: 'user',
							label: 'Returning Visitor',
							name: 'session.returning',
							type: 'boolean'
						},
						{
							defaultValue: 'false',
							icon: 'user',
							label: 'Authenticated',
							name: 'session.authenticated',
							type: 'boolean'
						},
						{
							defaultValue: 0,
							icon: 'integer',
							label: 'Page Views This Session',
							name: 'session.pageViews',
							type: 'number'
						},
						{
							defaultValue: 0,
							icon: 'time',
							label: 'Session Duration (seconds)',
							name: 'session.duration',
							type: 'number'
						},
						{
							defaultValue: 0,
							icon: 'integer',
							label: 'Total Sessions',
							name: 'session.totalSessions',
							type: 'number'
						},
						{
							defaultValue: 0,
							icon: 'integer',
							label: 'Days Since First Visit',
							name: 'session.daysSinceFirstVisit',
							type: 'number'
						},
						{
							defaultValue: 0,
							icon: 'integer',
							label: 'Days Since Last Visit',
							name: 'session.daysSinceLastVisit',
							type: 'number'
						},
						{
							defaultValue: 'new',
							icon: 'cog',
							label: 'Visitor State',
							name: 'session.visitorState',
							options: [
								{label: 'New', value: 'new'},
								{label: 'Active', value: 'active'},
								{label: 'Dormant', value: 'dormant'},
								{label: 'At Risk', value: 'at-risk'}
							],
							type: 'select'
						}
					]
				}
			]
		},
		{
			key: 'time',
			label: 'Time',
			subgroups: [
				{
					items: [
						{
							defaultValue: 0,
							icon: 'time',
							label: 'Current Hour (0-23)',
							name: 'time.hour',
							type: 'number'
						},
						{
							defaultValue: 'monday',
							icon: 'cog',
							label: 'Day of Week',
							name: 'time.dayOfWeek',
							options: [
								{label: 'Monday', value: 'monday'},
								{label: 'Tuesday', value: 'tuesday'},
								{label: 'Wednesday', value: 'wednesday'},
								{label: 'Thursday', value: 'thursday'},
								{label: 'Friday', value: 'friday'},
								{label: 'Saturday', value: 'saturday'},
								{label: 'Sunday', value: 'sunday'}
							],
							type: 'select'
						},
						{
							defaultValue: 'false',
							icon: 'check',
							label: 'Is Weekend',
							name: 'time.isWeekend',
							type: 'boolean'
						},
						{
							defaultValue: 'false',
							icon: 'check',
							label: 'Is Business Hours',
							name: 'time.isBusinessHours',
							type: 'boolean'
						},
						{
							defaultValue: '',
							icon: 'date',
							label: 'Current Date',
							name: 'time.date',
							type: 'date'
						},
						{
							defaultValue: 1,
							icon: 'integer',
							label: 'Day of Month (1-31)',
							name: 'time.dayOfMonth',
							type: 'number'
						},
						{
							defaultValue: 1,
							icon: 'integer',
							label: 'Month (1-12)',
							name: 'time.month',
							type: 'number'
						},
						{
							defaultValue: 1,
							icon: 'integer',
							label: 'Quarter (1-4)',
							name: 'time.quarter',
							type: 'number'
						},
						{
							defaultValue: 'holiday-none',
							icon: 'cog',
							label: 'Holiday Period',
							name: 'time.holiday',
							options: [
								{label: 'None', value: 'holiday-none'},
								{label: 'Black Friday', value: 'black-friday'},
								{label: 'Cyber Monday', value: 'cyber-monday'},
								{label: 'Christmas', value: 'christmas'},
								{label: "New Year's", value: 'new-years'},
								{label: 'Valentine', value: 'valentine'},
								{label: "Mother's Day", value: 'mothers-day'},
								{label: 'Other', value: 'other'}
							],
							type: 'select'
						}
					]
				}
			]
		}
	]
};

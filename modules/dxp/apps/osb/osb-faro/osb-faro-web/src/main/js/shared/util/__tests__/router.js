import {
	ACCOUNTS,
	buildRoutes,
	getMatchedRoute,
	getRouteName,
	INDIVIDUALS,
	removeUriQueryParam,
	Routes,
	SEGMENTS,
	setUriFilterValues,
	setUriQueryValue,
	setUriQueryValues,
	toRoute
} from '../router';
import {EntityTypes} from '../constants';
import {Map, Set} from 'immutable';

describe('setUriFilterValues', () => {
	it('should add filter queries to url and return as a string', () => {
		const mockFilterBy = new Map({
			biz: new Set(['buz']),
			foo: new Set(['bar', 'baz'])
		});

		const url = 'http://www.liferay.com';

		expect(setUriFilterValues(mockFilterBy, url)).toBe(
			'/?biz=buz&foo=bar%2Cbaz'
		);
	});
});

describe('setUriQueryValue', () => {
	it('should add query to url and return as a string', () => {
		const url = 'http://www.liferay.com';

		expect(setUriQueryValue(url, 'foo', 'bar')).toBe('/?foo=bar');
	});
});

describe('setUriQueryValues', () => {
	it('should add multiple queries to url and return as a string', () => {
		const url = 'http://www.liferay.com';

		expect(setUriQueryValues({baz: 'qux', foo: 'bar'}, url)).toBe(
			'/?baz=qux&foo=bar'
		);
	});

	it('should add multiple queries w/o passing any URL and return as a string', () => {
		expect(setUriQueryValues({baz: 'qux', foo: 'bar'})).toBe(
			'/?baz=qux&foo=bar'
		);
	});

	it('should add multiple queries by just passing pathname and return as a string', () => {
		expect(
			setUriQueryValues(
				{baz: 'qux', foo: 'bar'},
				'/workspaces/123/456/sites/overview'
			)
		).toBe('/workspaces/123/456/sites/overview?baz=qux&foo=bar');
	});
});

describe('getMatchedRoute', () => {
	it('should return the matched route', () => {
		expect(
			getMatchedRoute(
				[{route: '/foo/:id'}, {route: '/bar/:id'}],
				'/foo/123'
			)
		).toBe('/foo/:id');
	});
});

describe('getRouteName', () => {
	it('should return route name for a given type', () => {
		expect(getRouteName(EntityTypes.Account)).toBe(ACCOUNTS);
	});

	it('should return route name for the segment types', () => {
		expect(getRouteName(EntityTypes.IndividualsSegment)).toBe(SEGMENTS);
	});
});

describe('removeUriQueryParam', () => {
	it('should remove uri query param', () => {
		const href =
			'http://localhost:3000/project/33551/touchpoints/?sortField=views';
		const name = 'sortField';
		const removeURI = removeUriQueryParam(href, name);

		expect(removeURI).toEqual('/project/33551/touchpoints/');
	});
});

describe('setUriFilterValues', () => {
	it('should set the uri filter params from the filterBy Map', () => {
		const url = 'http://www.liferay.com';

		const mockFilterBy = new Map({
			devices: new Set(['desktop', 'mobile']),
			foo: new Set(['bar'])
		});

		expect(setUriFilterValues(mockFilterBy, url)).toBe(
			'/?devices=desktop%2Cmobile&foo=bar'
		);
	});

	it('should set the uri filter params w/o passing any URL', () => {
		const mockFilterBy = new Map({
			devices: new Set(['desktop', 'mobile']),
			foo: new Set(['bar'])
		});

		expect(setUriFilterValues(mockFilterBy)).toBe(
			'/?devices=desktop%2Cmobile&foo=bar'
		);
	});

	it('should set the uri filter params by just passing pathname instead of url', () => {
		const mockFilterBy = new Map({
			devices: new Set(['desktop', 'mobile']),
			foo: new Set(['bar'])
		});

		expect(
			setUriFilterValues(
				mockFilterBy,
				'/workspaces/123/456/sites/overview'
			)
		).toBe(
			'/workspaces/123/456/sites/overview?devices=desktop%2Cmobile&foo=bar'
		);
	});
});

describe('Routes', () => {
	it('should match Routes snapshot', () => {
		expect(Routes).toMatchSnapshot();
	});
});

describe('toRoute', () => {
	it('should create a url for specific options', () => {
		const id = 123;

		const groupId = 456;

		expect(
			toRoute(Routes.CONTACTS_ENTITY, {groupId, id, type: INDIVIDUALS})
		).toBe(`/workspace/${groupId}/contacts/${INDIVIDUALS}/${id}`);

		expect(
			toRoute(Routes.CONTACTS_ENTITY, {groupId, id, type: SEGMENTS})
		).toBe(`/workspace/${groupId}/contacts/${SEGMENTS}/${id}`);
	});
});

describe('buildRoutes', () => {
	it('should return an object with keys that map to route strings', () => {
		const routes = buildRoutes({
			BAR: '/bar',
			FOO: '/foo'
		});

		expect(routes).toMatchObject({
			BAR: '/bar',
			FOO: '/foo'
		});
	});

	it('should allow for nesting of routes using route objects', () => {
		const routes = buildRoutes({
			BAR: {
				path: '/bar',
				routes: {
					BAZ: '/baz',
					BIZ: '/biz',
					FIZZ: {
						path: '/fizz',
						routes: {
							BUZZ: '/buzz'
						}
					}
				}
			},
			FOO: '/foo'
		});

		expect(routes).toMatchObject({
			BAR: '/bar',
			BAZ: '/bar/baz',
			BIZ: '/bar/biz',
			BUZZ: '/bar/fizz/buzz',
			FIZZ: '/bar/fizz',
			FOO: '/foo'
		});
	});
});

import BundleElement from 'route-middleware/BundleRouter';
import Loading from 'shared/components/Loading';
import React, {lazy, Suspense} from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import {DEVELOPER_MODE, ENABLE_BLOCKLIST_KEYWORDS} from 'shared/util/constants';
import {relativeRoute, Routes} from 'shared/util/router';
import {Route, Routes as RouterRoutes} from 'react-router-dom';

// Inside Definitions, paths are relative to /workspace/:groupId/settings/definitions.
const defRel = (absPath: string) =>
	relativeRoute(Routes.SETTINGS_DEFINITIONS, absPath);

const EventBlockList = lazy(
	() =>
		import(/* webpackChunkName: "BlockList" */ '../events/pages/BlockList')
);

const Overview = lazy(
	() => import(/* webpackChunkName: "DefinitionsOverview" */ './Overview')
);

const IndividualAttributes = lazy(
	() =>
		import(
			/* webpackChunkName: "DefinitionsIndividualAttributes" */ './IndividualAttributes'
		)
);

const InterestTopics = lazy(
	() =>
		import(
			/* webpackChunkName: "DefinitionsInterestTopics" */ './InterestTopics'
		)
);

const TrackedBehaviors = lazy(
	() =>
		import(/* webpackChunkName: "TrackedBehaviors" */ './TrackedBehaviors')
);

const Search = lazy(
	() => import(/* webpackChunkName: "DefinitionsSearch" */ './search/Search')
);

const Events = lazy(
	() =>
		import(
			/* webpackChunkName: "DefinitionsEvents" */ '../events/pages/Events'
		)
);

const EventAttributes = lazy(
	() =>
		import(
			/* webpackChunkName: "DefinitionsEvents" */ '../event-attributes/pages/EventAttributes'
		)
);

const EventView = lazy(
	() =>
		import(
			/* webpackChunkName: "DefinitionsEventView" */ '../events/pages/View'
		)
);

const AttributeView = lazy(
	() =>
		import(
			/* webpackChunkName: "DefinitionsEventAttributesView" */ '../event-attributes/pages/AttributeView'
		)
);

interface IDefinitionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const Definitions: React.FC<IDefinitionsProps> = () => (
	<Suspense fallback={<Loading />}>
		<RouterRoutes>
			<Route element={<BundleElement data={Overview} />} path='' />

			{ENABLE_BLOCKLIST_KEYWORDS && (
				<Route
					element={<BundleElement data={InterestTopics} />}
					path={defRel(Routes.SETTINGS_DEFINITIONS_INTEREST_TOPICS)}
				/>
			)}

			<Route
				element={<BundleElement data={IndividualAttributes} />}
				path={defRel(Routes.SETTINGS_DEFINITIONS_INDIVIDUAL_ATTRIBUTES)}
			/>

			<Route
				element={<BundleElement data={Search} />}
				path={defRel(Routes.SETTINGS_DEFINITIONS_SEARCH)}
			/>

			{DEVELOPER_MODE && (
				// TODO: LRAC-4511 Remove when new TrackedBehavior page exists
				<Route
					element={<BundleElement data={TrackedBehaviors} />}
					path={defRel(Routes.SETTINGS_DEFINITIONS_BEHAVIORS)}
				/>
			)}

			<Route
				element={<BundleElement data={AttributeView} />}
				path={defRel(Routes.SETTINGS_DEFINITIONS_EVENT_ATTRIBUTES_VIEW)}
			/>

			<Route
				element={<BundleElement data={Events} />}
				path={defRel(Routes.SETTINGS_DEFINITIONS_EVENTS_CUSTOM)}
			/>

			<Route
				element={<BundleElement data={Events} />}
				path={defRel(Routes.SETTINGS_DEFINITIONS_EVENTS_DEFAULT)}
			/>

			<Route
				element={<BundleElement data={EventAttributes} />}
				path={defRel(
					Routes.SETTINGS_DEFINITIONS_EVENT_ATTRIBUTES_LOCAL
				)}
			/>

			<Route
				element={<BundleElement data={EventAttributes} />}
				path={defRel(
					Routes.SETTINGS_DEFINITIONS_EVENT_ATTRIBUTES_GLOBAL
				)}
			/>

			<Route
				element={<BundleElement data={EventBlockList} />}
				path={defRel(Routes.SETTINGS_DEFINITIONS_EVENTS_BLOCK_LIST)}
			/>

			<Route
				element={<BundleElement data={EventView} />}
				path={defRel(Routes.SETTINGS_DEFINITIONS_EVENTS_VIEW)}
			/>

			<Route element={<RouteNotFound />} path='*' />
		</RouterRoutes>
	</Suspense>
);

export default Definitions;

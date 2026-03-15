import AttributeList from '../event-attributes/components/AttributeList';
import AttributeView from '../event-attributes/pages/AttributeView';
import BundleRouter from 'route-middleware/BundleRouter';
import CustomEventList from '../events/components/CustomEventList';
import EventBlockList from '../events/pages/BlockList';
import EventList from '../events/components/EventList';
import EventView from '../events/pages/View';
import GlobalAttributeList from '../event-attributes/components/GlobalAttributeList';
import IndividualAttributes from './IndividualAttributes';
import InterestTopics from './InterestTopics';
import Loading from 'shared/components/Loading';
import Overview from './Overview';
import React, {lazy, Suspense} from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import Search from './search/Search';
import TrackedBehaviors from './TrackedBehaviors';
import {DEVELOPER_MODE, ENABLE_BLOCKLIST_KEYWORDS} from 'shared/util/constants';
import {Routes as Path} from 'shared/util/router';
import {Route, Routes} from 'react-router';

const Definitions = () => (
	<Suspense fallback={<Loading />}>
		<Routes>
			<Route element={<Overview />} index />

			{ENABLE_BLOCKLIST_KEYWORDS && (
				<Route element={<InterestTopics />} path='/interest-topics' />
			)}

			<Route
				element={
					<BundleRouter
						data={IndividualAttributes}
						path='/individual-attributes'
					/>
				}
				path='/individual-attributes'
			/>

			<Route element={<Search />} path='/search' />

			{DEVELOPER_MODE && (
				// TODO: LRAC-4511 Remove when new TrackedBehavior page exists
				<Route element={<TrackedBehaviors />} path='/behaviors' />
			)}

			<Route
				element={<AttributeView />}
				path='/event-attributes/:attributeId'
			/>

			<Route
				element={
					<BundleRouter
						data={AttributeList}
						path='/event-attributes/local'
					/>
				}
				path='/event-attributes/local'
			/>

			<Route
				element={<GlobalAttributeList />}
				path='/event-attributes/global'
			/>

			<Route element={<EventView />} path='/events/:eventId' />

			<Route element={<EventBlockList />} path='/events/block-list' />

			<Route element={<EventList />} path='/events/default' />

			<Route element={<CustomEventList />} path='/events/custom' />

			{/* <RouteNotFound /> */}
		</Routes>
	</Suspense>
);

export default Definitions;

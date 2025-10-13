import React, {createContext, useContext, useReducer} from 'react';
import {Channel} from 'shared/components/channels-menu';
import {Project, User} from 'shared/util/records';

interface IAppContext {
	channels: Channel[];
	currentUser: User | null;
	project: Project;
	selectedChannel: Channel | null;
	setChannels: (channels: Channel[]) => void;
	setCurrentUser: (user: User) => void;
	setProject: (project: Project[]) => void;
	setSelectedChannel: (channel: Channel) => void;
	setOnboardingTriggered: (onboardingTriggered: boolean) => void;
	onboardingTriggered: boolean;
}

const initialState: IAppContext = {
	channels: [],
	currentUser: new User({
		emailAddress: '',
		id: '',
		name: '',
		roleName: '',
		status: 1
	}),
	onboardingTriggered: false,
	project: null,
	selectedChannel: null,
	setChannels: () => {},
	setCurrentUser: () => {},
	setOnboardingTriggered: () => {},
	setProject: () => {},
	setSelectedChannel: () => {}
};

export const AppContext = createContext(initialState);

AppContext.displayName = 'AppContext';

enum ActionTypes {
	setChannels = 'SET_CHANNELS',
	SetCurrentUser = 'SET_CURRENT_USER',
	SetOnboardingTriggered = 'SET_ONBOARDING_TRIGGERED',
	SetProject = 'SET_PROJECT',
	setSelectedChannel = 'SET_SELECTED_CHANNEL'
}

const reducer = (
	state,
	action: {
		type: ActionTypes;
		payload: any;
	}
) => {
	switch (action.type) {
		case ActionTypes.setChannels:
			return {
				...state,
				channels: action.payload
			};
		case ActionTypes.SetCurrentUser:
			return {
				...state,
				currentUser: new User(action.payload)
			};

		case ActionTypes.SetOnboardingTriggered:
			return {
				...state,
				onboardingTriggered: action.payload
			};
		case ActionTypes.SetProject:
			return {
				...state,
				project: new Project(action.payload)
			};
		case ActionTypes.setSelectedChannel:
			return {
				...state,
				selectedChannel: action.payload
			};
		default: {
			throw new Error('Unhandled action type for App Context Reducer');
		}
	}
};

const AppContextProvider = ({children}) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const setChannels = (payload: Channel[]) => {
		dispatch({
			payload,
			type: ActionTypes.setChannels
		});
	};

	const setCurrentUser = (payload: User) => {
		dispatch({
			payload,
			type: ActionTypes.SetCurrentUser
		});
	};

	const setOnboardingTriggered = (payload: boolean) => {
		dispatch({
			payload,
			type: ActionTypes.SetOnboardingTriggered
		});
	};

	const setProject = (payload: Project) => {
		dispatch({
			payload,
			type: ActionTypes.SetProject
		});
	};

	const setSelectedChannel = (payload: Channel) => {
		dispatch({
			payload,
			type: ActionTypes.setSelectedChannel
		});
	};

	return (
		<AppContext.Provider
			value={{
				...state,
				setChannels,
				setCurrentUser,
				setOnboardingTriggered,
				setProject,
				setSelectedChannel
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

const useChannels = () => {
	const {channels} = useContext(AppContext);

	return channels;
};

const useCurrentUser = () => {
	const {currentUser} = useContext(AppContext);

	return currentUser;
};

const useProject = () => {
	const {project} = useContext(AppContext);

	return project;
};

const useSelectedChannel = () => {
	const {selectedChannel} = useContext(AppContext);

	return selectedChannel;
};

const useOnboardingTriggered = () => {
	const {onboardingTriggered} = useContext(AppContext);

	return onboardingTriggered;
};

export {
	useChannels,
	useCurrentUser,
	useOnboardingTriggered,
	useProject,
	useSelectedChannel
};

export default AppContextProvider;

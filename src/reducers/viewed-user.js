import { USER } from '../enums/user';

export default function reducer (state = {
	id: "",
	verified: "false",
	following: [],
	followers: [],
	profile: {},
	tracks: [],
	found: false,
	nextUrl: '',
	hasMore: false
  }, action) {
	switch (action.type) {

		case USER.VIEW_PROFILE: {
			state = Object.assign({}, state, action.payload, { found: true });
			break;
		}

		case USER.PROFILE_NOT_FOUND: {
			state = {
				id: "",
				verified: "false",
				following: [],
				followers: [],
				profile: {},
				tracks: [],
				found: false
			};
			break;
		}
		
		case USER.MORE_TRACKS_FETCHED: {
			state = {
				...state,
				tracks: state.tracks.concat(action.payload.tracks),
				nextUrl: action.payload.nextUrl,
				hasMore: action.payload.hasMore,
				shouldForcefullyIgnoreUpdateLogic: true
			}
			break;
		}
	}

	return state;
}
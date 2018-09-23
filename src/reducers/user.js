import { USER } from '../enums/user';

export default function reducer (state = {
    id: "",
    verified: "false",
    following: [],
    followers: [],
    profile: {},
    tracks: []
  }, action) {
    switch (action.type) {

        case USER.SUCCESSFULLY_LOGGED_IN: {
            state = Object.assign({}, state, action.payload.user);
            break;
        }

        case USER.MUST_LOGOUT: {
            state = {
                id: "",
                verified: "false",
                following: [],
                followers: [],
                profile: {},
                tracks: []
            };
            break;
        }

        case USER.HAS_NEW_DATA: {
            state = Object.assign({}, state, action.payload);
            break;
		}
		
		case USER.TOGGLED_LIKE_ON_TRACK: {
			state = {};
		}
    }

    return state;
}
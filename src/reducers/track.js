import { USER } from '../enums/user';
import { TRACK } from '../enums/track';

export default function reducer (state = { track: null, user: null }, action) {
	switch (action.type) {
		case TRACK.UPDATED_TRACK:
		case USER.GOT_TRACK: {
			console.log(action.payload.track);
			state = Object.assign({}, state, action.payload);
			break;
		}
	}

	return state;
};
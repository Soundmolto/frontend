import { USER } from '../enums/user';
import { TRACK } from '../enums/track';

export default function reducer (state = { track: null, user: null }, action) {
    switch (action.type) {
        case USER.GOT_TRACK: {
            state = Object.assign({}, state, action.payload);
            break;
		}
    }

    return state;
};
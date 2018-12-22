import { TRACK } from '../enums/track';

export default function reducer (state = [], action) {
	switch (action.type) {
		case TRACK.GOT_ALL_TRACKS: {
			state = action.payload || [];
			break;
		}
	}

	return state;
};
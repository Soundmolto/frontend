import { TRACK } from '../enums/track';

export default function reducer (state = false, action) {
	switch (action.type) {
		case TRACK.EDITING_TRACK: {
			state = { editing: true, track: action.payload.track };
			break;
		}

		case TRACK.NOT_EDITING_TRACK: {
			state = { editing: false, track: null };
			break;
		}
	}

	return state;
};
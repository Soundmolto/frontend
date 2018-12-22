import { TRACK } from '../enums/track';

export default function reducer (state = { tracks: [], nextUrl: '', hasMore: true }, action) {
	switch (action.type) {
		case TRACK.HAS_DISCOVER_TRACKS: {
			state = action.payload;
			break;
		}
		
		case TRACK.HAS_MORE_DISCOVER_TRACKS: {
			state = { tracks: state.tracks.concat(action.payload.tracks), nextUrl: action.payload.nextUrl, hasMore: action.payload.hasMore || false };
			break;
		}
	}

	return state;
};
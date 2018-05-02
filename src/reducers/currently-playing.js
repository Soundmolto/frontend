import { TRACK } from '../enums/track';

export default function reducer (state = { position: 0, track: null, playing: false, owner: null }, action) {
	switch (action.type) {
		case TRACK.PLAYING_TRACK: {
			const { position, track, owner } = action.payload;
			state = { ...state, position, track, owner, playing: true };
			break;
		}

		case TRACK.PAUSED_TRACK: {
			const { position, track, owner } = action.payload;
			state = { ...state, position, track, owner, playing: false };
			break;
		}
	}

	return state;
};
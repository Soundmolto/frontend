import ReactGA from 'react-ga';
import { TRACK } from '../enums/track';

export default function reducer (state = { position: 0, track: null, playing: false, owner: null }, action) {
	switch (action.type) {
		case TRACK.PLAYING_TRACK: {
			ReactGA.event({ category: 'SONGS', action: 'Play', label: 'Play song' })
			const { position, track, owner } = action.payload;
			state = { ...state, position, track, owner, playing: true };
			break;
		}

		case TRACK.PAUSED_TRACK: {
			ReactGA.event({ category: 'SONGS', action: 'Pause', label: 'Play song' })
			const { position, track, owner } = action.payload;
			state = { ...state, position, track, owner, playing: false };
			break;
		}
	}

	return state;
};
import { PLAYLIST } from '../enums/playlist';

export default function reducer (state = { playlist: { tracks: [], owner: {} }, user: {} }, action) {
    switch (action.type) {
        case PLAYLIST.GOT_PLAYLIST: {
            state = { ...action.payload };
            break;
		}
		
		case PLAYLIST.UPDATED_PLAYLIST: {
            state = { ...action.payload };
            break;
        }
    }

    return state;
};
import { TRACK } from '../enums/track';

export default function reducer (state = [], action) {
    switch (action.type) {
        case TRACK.HAS_DISCOVER_TRACKS: {
            state = [].concat(action.payload);
            break;
        }
    }

    return state;
};
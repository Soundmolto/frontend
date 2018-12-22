import { TRACK } from '../enums/track';

export default function reducer (state = [], action) {
    switch (action.type) {
        case TRACK.HAS_TRACK_COLLECTION: {
            state = [].concat(action.payload);
            break;
        }
    }

    return state;
};
import { ANALYTICS } from '../enums/analytics';

export default function reducer (state = { listeners: [], totalPlays: 0, user: {} }, action) {
    switch (action.type) {
        case ANALYTICS.ANALYTICS_FETCHED_SUCCESSFULLY: {
            state = action.payload;
            break;
		}
		
		case ANALYTICS.ANALYTICS_FETCHED_UNSUCCESSFULLY: {
            state = action.payload;
            break;
        }

    }

    return state;
}
import { SEARCH } from "../enums/search";

export default function reducer (state = { show: false }, action) {
    switch (action.type) {
        case SEARCH.SHOW_SEARCH_PANEL: {
            state = { show: true };
            break;
		}
		
		case SEARCH.HIDE_SEARCH_PANEL: {
            state = { show: false };
            break;
        }
    }

    return state;
};
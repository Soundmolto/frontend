import { NOTIFICATIONS } from '../enums/notifications';

export default function reducer (state = { notifications: [] }, action) {
    switch (action.type) {
        case NOTIFICATIONS.GOT_NOTIFICATIONS: {
            state = action.payload;
            break;
        }

    }

    return state;
}
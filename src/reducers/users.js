import { USER } from '../enums/user';

export default function reducer (state = [], action) {
    switch (action.type) {
        case USER.GOT_ALL_USERS: {
            state = action.payload.splice(0);
            break;
        }
    }

    return state;
}
import { USER } from '../enums/user';

export default function reducer (state = [], action) {
    switch (action.type) {
        case USER.GOT_FOLLOWING_USERS: {
            state = action.payload.following;
            break;
        }
    }

    return state;
}
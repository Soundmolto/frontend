import { USER } from '../enums/user';

export default function reducer (state = { logged_in: false, logging_in: false, error: false, token: null }, action) {
    switch (action.type) {
        case USER.LOGIN_REQUESTED: {
            state = { ...state, logging_in: true };
            break;
        }
        
        case USER.SUCCESSFULLY_LOGGED_IN: {
            state = { ...state, logged_in: true, logging_in: false, token: action.payload.token };
            break;
        }

        case USER.FAILED_LOGIN: {
            state = { ...state, logged_in: false, logging_in: false, error: true };
            break;
        }

        case USER.MUST_LOGOUT: {
            state = { logged_in: false, logging_in: false, error: false, token: null };
            break;
        }
    }

    return state;
}
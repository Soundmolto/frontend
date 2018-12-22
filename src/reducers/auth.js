import { USER } from '../enums/user';

export default function reducer (state = { logged_in: false, loading: false, error: false, token: null }, action) {
    switch (action.type) {
        case USER.LOADING: {
            state = { ...state, loading: true };
            break;
        }
        
        case USER.SUCCESSFULLY_LOGGED_IN: {
            state = { ...state, logged_in: true, loading: false, token: action.payload.token };
            break;
        }

        case USER.FAILED_LOGIN: {
            state = { ...state, logged_in: false, loading: false, error: true, errorMessage: action.payload.error };
            break;
        }

        case USER.MUST_LOGOUT: {
            state = { logged_in: false, loading: false, error: false, token: null };
            break;
        }

        case USER.SUCCESSFULLY_REGISTERED: {
            state = { ...state, logged_in: false, loading: false };
            break;
        }

        case USER.FAILED_REGISTER: {
            state = { ...state, logged_in: false, loading: false, error: true, errorMessage: action.payload.error };
            break;
        }

    }

    return state;
}
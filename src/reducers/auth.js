export default function reducer (state = { logged_in: false, logging_in: false, error: false }, action) {
    switch (action.type) {
        case "USER_REQUESTED_LOGIN": {
            state = { ...state, logging_in: true };
            break;
        }
        
        case "USER_LOGIN_SUCCEEDED": {
            state = { ...state, logged_in: true, logging_in: false };
            break;
        }

        case "USER_LOGIN_FAILED": {
            state = { ...state, logged_in: false, logging_in: false, error: true };
            break;
        }
    }

    return state;
}
export default function reducer (state = { logged_in: false, logging_in: false, error: false, token: null }, action) {
    switch (action.type) {
        case "USER_REQUESTED_LOGIN": {
            console.log(action);
            state = { ...state, logging_in: true };
            break;
        }
        
        case "USER_LOGIN_SUCCEEDED": {
            state = { ...state, logged_in: true, logging_in: false, token: action.payload.token };
            break;
        }

        case "USER_LOGIN_FAILED": {
            state = { ...state, logged_in: false, logging_in: false, error: true };
            break;
        }
    }

    return state;
}
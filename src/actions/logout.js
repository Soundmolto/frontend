import { USER } from '../enums/user';

export function logout () {
    return {
        type: USER.MUST_LOGOUT,
        payload: null
    }
}
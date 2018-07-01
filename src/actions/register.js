import { API_ENDPOINT } from '../api';
import { USER } from '../enums/user';

export function begin_register () {
	if (typeof window !== "undefined") localStorage.clear();
    return {
        type: USER.LOADING
    }
}

export async function register (body, dispatch, done) {
    let returnObject = {};

    try {
        const data = await fetch(`${API_ENDPOINT}/register`, {
            body: JSON.stringify(body),
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const payload = await data.json();

        if (data.status === 200) {
            returnObject = {
                type: USER.SUCCESSFULLY_LOGGED_IN,
                payload: payload
            }
        } else {
            throw new Error(payload.error);
        }

    } catch (error) {
        returnObject = {
            type: USER.FAILED_REGISTER,
            payload: { error: error.message }
        };
    } finally {
        return dispatch(returnObject);
    }
}

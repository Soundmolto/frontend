import { API_ENDPOINT } from '../api';
import { USER } from '../enums/user';

export function begin_login () {
    localStorage.clear();
    return {
        type: USER.LOADING
    }
}

export async function login (body, dispatch, done) {
    let returnObject = {};

    try {
        const data = await fetch(`${API_ENDPOINT}/login`, {
            body: JSON.stringify(body),
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (data.status === 200) {
            returnObject = {
                type: USER.SUCCESSFULLY_LOGGED_IN,
                payload: await data.json()
            }
        } else {
            throw new Error(data.statusText);
        }

    } catch (error) {
        returnObject = {
            type: USER.FAILED_LOGIN,
            payload: { error }
        };
    } finally {
        if (done != null && typeof done === 'function') {
            done();
        }

        return dispatch(returnObject);
    }
}

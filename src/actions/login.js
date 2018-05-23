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

        const payload =  await data.json();

        if (data.status === 200) {
            returnObject = {
                type: USER.SUCCESSFULLY_LOGGED_IN,
                payload
            }
        } else {
            throw new Error(payload.error);
        }

    } catch (error) {
        returnObject = {
            type: USER.FAILED_LOGIN,
            payload: { error: error.message }
        };
    } finally {
        if (done != null && typeof done === 'function' && returnObject.type !== USER.FAILED_LOGIN) {
            done();
        }

        return dispatch(returnObject);
    }
}

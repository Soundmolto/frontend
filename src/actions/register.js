import { API_ENDPOINT } from '../api';
import { USER } from '../enums/user';
import { route } from 'preact-router';

export function begin_register () {
    localStorage.clear();
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
            type: USER.FAILED_REGISTER,
            payload: { error }
        };
    } finally {
        return dispatch(returnObject);

        // if (done != null && typeof done === 'function') {
        //     done();
        // }

        // if (returnObject.type === USER.SUCCESSFULLY_LOGGED_IN) {
        //     return route("/login");
        // }
    }
}

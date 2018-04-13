import { API_ENDPOINT } from '../api';

export function begin_login () {
    return {
        type: "USER_REQUESTED_LOGIN"
    }
}

export async function login (body, dispatch) {
    console.log(dispatch);
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
                type: "USER_LOGIN_SUCCEEDED",
                payload: await data.json()
            }
        } else {
            throw new Error(data.statusText);
        }

    } catch (error) {
        returnObject = {
            type: "USER_LOGIN_FAILED",
            payload: { error }
        };
    } finally {
        return dispatch(returnObject);
    }
}
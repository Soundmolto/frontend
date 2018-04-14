import { API_ENDPOINT } from '../api';
import { prefill_auth } from '../prefill-authorized-route';

export async function request_new_data (dispatch, { token, vanity_url }) {
    let returnObject = {};

    if (token )

    try {
        const data = await fetch(`${API_ENDPOINT}/users/${vanity_url}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...prefill_auth(token)
            }
        });

        if (data.status === 200) {
            returnObject = {
                type: "USER_NEW_DATA",
                payload: await data.json()
            }
        } else {
            throw new Error(data.statusText);
        }

    } catch (error) {
        console.log(error);
    } finally {
        return dispatch(returnObject);
    }
}

export async function fetch_users (dispatch) {
    let returnObject = {};

    try {
        const data = await fetch(`${API_ENDPOINT}/users`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        if (data.status === 200) {
            returnObject = {
                type: "ALL_USERS",
                payload: await data.json()
            }
        } else {
            throw new Error(data.statusText);
        }

    } catch (error) {
        console.log(error);
    } finally {
        return dispatch(returnObject);
    }
}
import { API_ENDPOINT } from '../api';
import { prefill_auth } from '../prefill-authorized-route';

export async function request_new_data (dispatch, { token, vanity_url }) {
    let returnObject = {};
    let error = {};

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
            error = data;
            throw new Error(data.statusText);
        }

    } catch (e) {
        console.log(e);
        if (error.status === 404 || error.status === 403 || error.status === 401) {
            returnObject = {
                type: "USER_LOGOUT"
            }
        }
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

export async function fetch_user (dispatch, { token, vanity_url }) {
    let returnObject = {};
    let error = {};

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
                type: "VIEW_PROFILE",
                payload: await data.json()
            }
        } else {
            error = await data.json()
            throw new Error(data.statusText);
        }

    } catch (e) {
        console.log(e);

        if (error.error === 'User not found') {
            returnObject = {
                type: "PROFILE_NOT_FOUND",
                payload: {}
            }
        }
    } finally {
        return dispatch(returnObject);
    }
}

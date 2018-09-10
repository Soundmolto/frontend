import { API_ENDPOINT } from '../api';
import { prefill_auth } from '../prefill-authorized-route';
import { USER } from '../enums/user';

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
                type: USER.HAS_NEW_DATA,
                payload: await data.json()
            }
        } else {
            error = data;
            throw new Error(data.statusText);
        }

    } catch (e) {
        if (error.status === 404 || error.status === 403 || error.status === 401) {
            returnObject = {
                type: USER.MUST_LOGOUT
            }
        }
    } finally {
        return dispatch(returnObject);
    }
}

export async function fetch_users (dispatch, token) {
    let returnObject = {};

    try {
        const data = await fetch(`${API_ENDPOINT}/users`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...prefill_auth(token)
            }
        });

        if (data.status === 200) {
            returnObject = {
                type: USER.GOT_ALL_USERS,
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
                type: USER.VIEW_PROFILE,
                payload: await data.json()
            }
        } else {
            error = await data.json()
            throw new Error(data.statusText);
        }

    } catch (e) {

        if (error.error === 'User not found') {
            returnObject = {
                type: USER.PROFILE_UPDATE_FAILURE,
                payload: {}
            }
        }
    } finally {
        return dispatch(returnObject);
    }
}

export async function follow_user (dispatch, { token, user }) {
    let returnObject = {};
    let error = {};

    try {
        const data = await fetch(`${API_ENDPOINT}/users/${user.id}/follow`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...prefill_auth(token)
            },
            method: "POST"
        });

        if (data.status === 200) {
            returnObject = {
                type: USER.VIEW_PROFILE,
                payload: await data.json()
            }
        } else {
            error = await data.json()
            throw new Error(data.statusText);
        }

    } catch (e) {
        if (error.error === 'User not found') {
            returnObject = {
                type: USER.PROFILE_UPDATE_FAILURE,
                payload: {}
            }
        }
    } finally {
        return dispatch(returnObject);
    }
}

export async function unfollow_user (dispatch, { token, user }) {
    let returnObject = {};
    let error = {};

    try {
        const data = await fetch(`${API_ENDPOINT}/users/${user.id}/unfollow`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...prefill_auth(token)
            },
            method: "POST"
        });

        if (data.status === 200) {
            returnObject = {
                type: USER.VIEW_PROFILE,
                payload: await data.json()
            }
        } else {
            error = await data.json()
            throw new Error(data.statusText);
        }

    } catch (e) {
        if (error.error === 'User not found') {
            returnObject = {
                type: USER.PROFILE_UPDATE_FAILURE,
                payload: {}
            }
        }
    } finally {
        return dispatch(returnObject);
    }
}

export async function delete_user (dispatch, { token, user_id }) {
    let returnObject = {};
    let error = {};
    let data;

    try {
        data = await fetch(`${API_ENDPOINT}/users/${user_id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...prefill_auth(token)
            },
            method: "DELETE"
        });

        if (data.status !== 204) {
            error = await data.json();
            throw new Error(data.statusText);
        }

    } catch (e) {
        console.log(e);
    } finally {
        if (data.status === 204) {
            await fetch_users (dispatch, token);
        }
        return dispatch(returnObject);
    }
}
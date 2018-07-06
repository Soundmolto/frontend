import { API_ENDPOINT } from '../api';
import { USER } from '../enums/user';
import { TRACK } from '../enums/track';
import { prefill_auth } from '../prefill-authorized-route';

export async function edit_track (dispatch, { track, token, id }) {
    let returnObject = {};

    try {
        const data = await fetch(`${API_ENDPOINT}/tracks/${id}`, {
            body: JSON.stringify(track),
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...prefill_auth(token)
            }
        });

        if (data.status === 200) {
            returnObject = {
                type: USER.TRACK_UPDATE_SUCCESS,
                payload: await data.json()
            }
        } else {
            throw new Error(data.statusText);
        }

    } catch (error) {
        returnObject = {
            type: USER.PROFILE_UPDATE_FAILURE,
            payload: { error }
        };
    } finally {
        if (returnObject.error == null) {
            dispatch({
                type: USER.HAS_NEW_DATA,
                payload: Object.assign({}, returnObject.payload)
            })
        }
        return dispatch(returnObject);
    }
};

export async function delete_track (dispatch, { track, token, id }) {
	let returnObject = {};

    try {
        const data = await fetch(`${API_ENDPOINT}/tracks/${id}`, {
            body: JSON.stringify(track),
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...prefill_auth(token)
            }
        });

        if (data.status === 200) {
            returnObject = {
                type: USER.TRACK_DELETE_SUCCESS,
                payload: await data.json()
            }
        } else {
            throw new Error(data.statusText);
        }

    } catch (error) {
        returnObject = {
            type: USER.PROFILE_UPDATE_FAILURE,
            payload: { error }
        };
    } finally {
        if (returnObject.error == null) {
            dispatch({
                type: USER.HAS_NEW_DATA,
                payload: Object.assign({}, returnObject.payload)
            })
        }
        return dispatch(returnObject);
    }
}

export async function get_track (dispatch, { token, track_url, vanity_url }) {
	let returnObject = {};

    try {
        const data = await fetch(`${API_ENDPOINT}/${vanity_url}/${track_url}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...prefill_auth(token)
            }
        });

        if (data.status === 200) {
            returnObject = {
                type: USER.GOT_TRACK,
                payload: await data.json()
            }
        } else {
            throw new Error(data.statusText);
        }

    } catch (error) {
        returnObject = {
            type: USER.TRACK_NOT_FOUND,
            payload: { error }
        };
    } finally {
        return dispatch(returnObject);
    }
}

export function playing_now (dispatch, { playing, position, track, owner }) {
	let type = TRACK.PLAYING_TRACK;
	if (!playing) type = TRACK.PAUSED_TRACK;
	delete track.peaks;
	return dispatch({ type: type, payload: { position, track, owner } })
}

export function update_position (dispatch, { playing, position, track, owner }) {
	return dispatch({ type: TRACK.POS_CHANGE, payload: { position, track, owner } })
}

export async function get_discover_tracks (dispatch) {
    let returnObject = {};
    let error = {};

    try {
        const data = await fetch(`${API_ENDPOINT}/discover`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (data.status === 200) {
            returnObject = {
                type: TRACK.HAS_DISCOVER_TRACKS,
                payload: await data.json()
            }
        } else {
            error = data;
            throw new Error(data.statusText);
        }
    } catch (error) {
        console.error(error);
    } finally {
        dispatch(returnObject);
    }

}
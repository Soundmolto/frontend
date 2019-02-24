import { API_ENDPOINT } from '../api';
import { USER } from '../enums/user';
import { TRACK } from '../enums/track';
import { prefill_auth } from '../prefill-authorized-route';
import store from '../store';

export async function submit_comment (dispatch, { id, token, comment }, done) {
	let returnObject = {};

	try {
		const data = await fetch(`${API_ENDPOINT}/tracks/${id}/comment`, {
			body: JSON.stringify({ comment }),
			method: "POST",
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
				type: TRACK.UPDATED_TRACK,
				payload: returnObject.payload
			})
		}
		done();
		return dispatch(returnObject);
	}
};


export async function delete_comment (dispatch, { id, token, track }) {
	let returnObject = {};

	try {
		const data = await fetch(`${API_ENDPOINT}/comments/${id}`, {
			body: JSON.stringify({ trackID: track.id }),
			method: "DELETE",
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
				type: TRACK.UPDATED_TRACK,
				payload: returnObject.payload
			})
		}
		return dispatch(returnObject);
	}
};
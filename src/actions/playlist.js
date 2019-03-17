import { PLAYLIST } from '../enums/playlist';
import { API_ENDPOINT } from '../api';
import { prefill_auth } from '../prefill-authorized-route';
import { USER } from '../enums/user';
import { route } from 'preact-router';

export async function get_playlist (dispatch, { playlistID }) {
	let returnObject = {};

	try {
		const data = await fetch(`${API_ENDPOINT}/playlist/${playlistID}`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		});

		if (data.status === 200) {
			returnObject = {
				type: PLAYLIST.GOT_PLAYLIST,
				payload: await data.json()
			}
		} else {
			// returnObject = data;
			if (data.status === 404) {
				route('/');
			}
			throw new Error(data.statusText);
		}
	} catch (error) {
		console.error(error);
	} finally {
		dispatch(returnObject);
	}
}

export async function update_playlist (dispatch, { id, name, description, token }) {
	let returnObject = {};

	try {
		const data = await fetch(`${API_ENDPOINT}/playlist/${id}`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				...prefill_auth(token)
			},
			method: 'PUT',
			body: JSON.stringify({ name, description })
		});

		if (data.status === 200) {
			returnObject = {
				type: PLAYLIST.UPDATED_PLAYLIST,
				payload: await data.json()
			}
		} else {
			// returnObject = data;
			throw new Error(data.statusText);
		}
	} catch (error) {
		console.error(error);
	} finally {
		dispatch(returnObject);
	}
}

export async function create_playlist (dispatch, { name, description, token }) {
	let returnObject = {};

	try {
		const data = await fetch(`${API_ENDPOINT}/playlist/create`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				...prefill_auth(token)
			},
			method: "POST",
			body: JSON.stringify({ name, description })
		});

		if (data.status === 200) {
			returnObject = {
				type: PLAYLIST.CREATED_PLAYLIST,
				payload: await data.json()
			}
		} else {
			// returnObject = data;
			throw new Error(data.statusText);
		}
	} catch (error) {
		console.error(error);
	} finally {
		dispatch(returnObject);
	}
}

export async function delete_playlist (dispatch, { id, token }) {
	let returnObject = {};

	try {
		const data = await fetch(`${API_ENDPOINT}/playlist/${id}`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				...prefill_auth(token)
			},
			method: "DELETE"
		});

		if (data.status === 200) {
			returnObject = {
				type: USER.HAS_NEW_DATA,
				payload: await data.json()
			}
		} else {
			// returnObject = data;
			throw new Error(data.statusText);
		}
	} catch (error) {
		console.error(error);
	} finally {
		dispatch(returnObject);
	}
}

export async function add_track_to_playlist (dispatch, { trackID, id, token }) {
	let returnObject = {};

	try {
		const data = await fetch(`${API_ENDPOINT}/playlist/${id}/tracks`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				...prefill_auth(token)
			},
			method: "PUT",
			body: JSON.stringify({ tracks: [trackID] })
		});

		if (data.status === 200) {
			returnObject = {
				type: PLAYLIST.UPDATED_PLAYLIST,
				payload: await data.json()
			}
		} else {
			// returnObject = data;
			throw new Error(data.statusText);
		}
	} catch (error) {
		console.error(error);
	} finally {
		dispatch(returnObject);
	}
}
import { PLAYLIST } from '../enums/playlist';
import { API_ENDPOINT } from '../api';

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
			throw new Error(data.statusText);
		}
	} catch (error) {
		console.error(error);
	} finally {
		dispatch(returnObject);
	}
}
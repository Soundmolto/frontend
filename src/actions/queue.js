import { QUEUE } from '../enums/queue';

export function set_queue (dispatch, { playing, position, track, owner }) {
	return dispatch({ type: "", payload: { position, track, owner } })
}
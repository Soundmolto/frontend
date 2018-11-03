import { TRACK } from '../enums/track';

export const start_editing_track = (dispatch, { track }) => dispatch({ type: TRACK.EDITING_TRACK, payload: { track } });

export const finish_editing_track = (dispatch) => dispatch({ type: TRACK.NOT_EDITING_TRACK, payload: { track: null } });


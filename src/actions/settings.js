import { SETTINGS } from '../enums/settings';

export function enable_beta (dispatch) {
    dispatch({
        type: SETTINGS.ENABLE_BETA,
        payload: {}
    })
}

export function disable_beta (dispatch) {
    dispatch({
        type: SETTINGS.DISABLE_BETA,
        payload: {}
    })
}

export function enable_waveform (dispatch) {
    dispatch({
        type: SETTINGS.ENABLE_WAVEFORMS,
        payload: {}
    })
}

export function disable_waveform (dispatch) {
    dispatch({
        type: SETTINGS.DISABLE_WAVEFORMS,
        payload: {}
    })
}
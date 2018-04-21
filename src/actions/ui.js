import { THEMES } from '../themes';

export function dark_theme (dispatch) {
    dispatch({
        type: "CHANGE_THEME",
        payload: {
            theme: THEMES.dark
        }
    })
}

export function light_theme (dispatch) {
    dispatch({
        type: "CHANGE_THEME",
        payload: {
            theme: THEMES.light
        }
    })
}
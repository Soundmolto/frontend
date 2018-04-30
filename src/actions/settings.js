import { SETTINGS } from '../enums/settings';

export function dark_theme (dispatch) {
    dispatch({
        type: THEMES.CHANGE_THEME,
        payload: {
            theme: THEMES.dark
        }
    })
}

export function light_theme (dispatch) {
    dispatch({
        type: THEMES.CHANGE_THEME,
        payload: {
            theme: THEMES.light
        }
    })
}
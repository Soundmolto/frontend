import { THEMES } from '../enums/themes';

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
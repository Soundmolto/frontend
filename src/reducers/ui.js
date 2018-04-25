import { THEMES } from '../enums/themes';

export default function reducer (state = { theme: THEMES.light, settings_open: false }, action) {
    switch (action.type) {
        case THEMES.CHANGE_THEME: {
            state = { ...state, theme: action.payload.theme };
            break;
        }

        case "SHOW_SETTINGS_PANEL": {
            state = { ...state, settings_open: true }
            break;
        }

        case "HIDE_SETTINGS_PANEL": {
            state = { ...state, settings_open: false };
            break;
        }
    }

    return state;
};
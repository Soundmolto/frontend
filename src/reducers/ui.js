import { THEMES } from '../enums/themes';
import { SETTINGS } from '../enums/settings';

export default function reducer (state = { theme: THEMES.dark, settings_open: false, goto_open: false, shortcuts_open: false }, action) {
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

        case "SHOW_GOTO_PANEL": {
            state = { ...state, goto_open: true };
            break;
        }

        case "HIDE_GOTO_PANEL": {
            state = { ...state, goto_open: false };
            break;
        }

        case "SHOW_SHORTCUTS_PANEL": {
            state = { ...state, shortcuts_open: true };
            break;
        }

        case "HIDE_SHORTCUTS_PANEL": {
            state = { ...state, shortcuts_open: false };
            break;
        }

        case SETTINGS.RESET: {
            state = Object.assign({}, state, action.payload);
            break;
        }
    }

    return state;
};
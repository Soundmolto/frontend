import { THEMES } from '../enums/themes';

export default function reducer (state = { theme: THEMES.light }, action) {
    switch (action.type) {
        case THEMES.CHANGE_THEME: {
            state = { theme: action.payload.theme };
            break;
        }
    }

    return state;
};
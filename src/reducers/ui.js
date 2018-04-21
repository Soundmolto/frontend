import { THEMES } from '../themes';

export default function reducer (state = { theme: THEMES.light }, action) {
    console.log(action);
    switch (action.type) {
        case "CHANGE_THEME": {
            state = { theme: action.payload.theme };
            break;
        }
    }

    return state;
};
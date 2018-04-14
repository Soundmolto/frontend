export default function reducer (state = [], action) {
    switch (action.type) {
        case "ALL_USERS": {
            state = action.payload.splice(0);
            break;
        }
    }

    return state;
}
export default function reducer (state = {
    id: "",
    verified: "false",
    following: [],
    followers: [],
    profile: {},
    tracks: []
  }, action) {
    switch (action.type) {

        case "USER_LOGIN_SUCCEEDED": {
            state = Object.assign({}, state, action.payload.user);
            break;
        }

        case "USER_LOGOUT": {
            state = {
                id: "",
                verified: "false",
                following: [],
                followers: [],
                profile: {},
                tracks: []
            };
            break;
        }
    }

    return state;
}
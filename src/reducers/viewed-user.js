export default function reducer (state = {
    id: "",
    verified: "false",
    following: [],
    followers: [],
    profile: {},
    tracks: [],
    found: false
  }, action) {
    switch (action.type) {

        case "VIEW_PROFILE": {
            state = Object.assign({}, state, action.payload, { found: true });
            break;
        }

        case "PROFILE_NOT_FOUND": {
            state = {
                id: "",
                verified: "false",
                following: [],
                followers: [],
                profile: {},
                tracks: [],
                found: false
              };
            break;
        }
    }

    return state;
}
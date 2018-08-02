import { combineReducers } from "redux";
import auth from './auth';
import user from './user';
import users from './users';
import viewedUser from './viewed-user';
import UI from './ui';
import currently_playing from './currently-playing';
import track from './track';
import discover from './discover';
import tracks from './tracks';

export default combineReducers({
    auth,
    user,
    users,
    viewedUser,
	UI,
    currently_playing,
    track,
	discover,
	tracks,
});
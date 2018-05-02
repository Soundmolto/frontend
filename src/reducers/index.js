import { combineReducers } from "redux";
import auth from './auth';
import user from './user';
import users from './users';
import viewedUser from './viewed-user';
import UI from './ui';
import currently_playing from './currently-playing';

export default combineReducers({
    auth,
    user,
    users,
    viewedUser,
	UI,
	currently_playing
});
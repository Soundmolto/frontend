import { combineReducers } from "redux";
import auth from './auth';
import user from './user';
import users from './users';
import viewedUser from './viewed-user';

export default combineReducers({
    auth,
    user,
    users,
    viewedUser
});
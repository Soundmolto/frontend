import { combineReducers } from "redux";
import auth from './auth';
import user from './user';
import users from './users';

export default combineReducers({
    auth,
    user,
    users
});
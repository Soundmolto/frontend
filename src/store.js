import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers';
import persistState from 'redux-localstorage'


const enhancer = compose(persistState(null, 'persistedState'));
let state = { auth: {} };

if (typeof window !== "undefined") {
    localStorage.setItem('persistedState', localStorage.getItem('persistedState') || JSON.stringify({ auth: {} }));
    state = JSON.parse(localStorage.getItem('persistedState'));
}

export default createStore(reducer, state, enhancer);

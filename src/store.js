import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers';
import persistState from 'redux-localstorage'

const enhancer = compose(
  persistState(null, { key: 'persistedState' }),
)

localStorage.setItem('persistedState', localStorage.getItem('persistedState') || JSON.stringify({ auth: {} }))
const state = JSON.parse(localStorage.getItem('persistedState'));
console.log(state);

export default createStore(reducer, state, enhancer);
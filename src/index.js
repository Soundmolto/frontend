import { Component } from 'preact';
import { Provider, connect } from 'preact-redux';
import { HotKeys } from 'react-hotkeys';
import { TRACK } from './enums/track'
import { SETTINGS } from './enums/settings'
import App from './components/App';
import store from './store';
import { shortcuts } from './shortcuts';
import './style';

let attach = null;

if (typeof window !== "undefined") {
	attach = window;
}

let map = {};
let handlers = {};

for (const shortcut of shortcuts) {
	map[shortcut.name] = shortcut.keys;
	handlers[shortcut.name] = shortcut.action;
}

class HotKeysHOC extends Component {

	map = map;
	handlers = handlers;

	constructor (opts) {
		super(opts);
		const state = store.getState();
		const payload = Object.assign({}, state.currently_playing, { position: 0 });
		const _payload = Object.assign({}, state.UI, { settings_open: false, goto_open: false, shortcuts_open: false });
		store.dispatch({ type: TRACK.PAUSED_TRACK, payload });
		store.dispatch({ type: SETTINGS.RESET, payload: _payload });
	}

	render ({ children }) {
		return (
			<HotKeys handlers={this.handlers} keyMap={this.map} focused={true} attach={attach}>
				{children}
			</HotKeys>
		);
	}
};

const Main = () => (
	<Provider store={store}>
		<HotKeysHOC>
			<App store={store} />
		</HotKeysHOC>
	</Provider>
);


export default Main;

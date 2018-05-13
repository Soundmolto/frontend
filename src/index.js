import { Component } from 'preact';
import { Provider, connect } from 'preact-redux';
import { HotKeys } from 'react-hotkeys';
import { TRACK } from './enums/track'
import { SETTINGS } from './enums/settings'
import App from './components/App';
import store from './store';
import './style';

let attach = null;

if (typeof window !== "undefined") {
	attach = window;
}

class HotKeysHOC extends Component {
	map = {
		'show:settings': 'ctrl+,',
		'show:goto': 'ctrl+g',
		'show:shortcuts': 'ctrl+/',
		'toggle:playing': 'space'
	};

	handlers = {
		'show:settings': e => {
			store.dispatch({
				type: "SHOW_SETTINGS_PANEL"
			})
		},
		'show:goto': e => {
			e.preventDefault();
			e.stopPropagation();
			store.dispatch({
				type: "SHOW_GOTO_PANEL"
			});
		},
		'show:shortcuts': e => {
			e.preventDefault();
			e.stopPropagation();
			store.dispatch({
				type: "SHOW_SHORTCUTS_PANEL"
			});
		},
		'toggle:playing': e => {
			const state = store.getState();
			e.preventDefault();

			if (state.currently_playing.track != null) {
				if (state.currently_playing.playing === true) {
					store.dispatch({
						type: TRACK.PAUSED_TRACK,
						payload: state.currently_playing
					})
				} else {
					store.dispatch({
						type: TRACK.PLAYING_TRACK,
						payload: state.currently_playing
					})
				}
			} else {
				
			}
		}
	};

	render ({ children }) {
		return (
			<HotKeys handlers={this.handlers} keyMap={this.map} focused={true} attach={attach}>
				{children}
			</HotKeys>
		);
	}

	constructor (opts) {
		super(opts);
		const state = store.getState();
		const payload = Object.assign({}, state.currently_playing, { position: 0 });
		const _payload = Object.assign({}, state.UI, { settings_open: false, goto_open: false, shortcuts_open: false });
		store.dispatch({ type: TRACK.PAUSED_TRACK, payload });
		store.dispatch({ type: SETTINGS.RESET, payload: _payload });
	}
};

const Main = () => (
	<Provider store={store}>
		<HotKeysHOC>
			<App />
		</HotKeysHOC>
	</Provider>
);


export default Main;

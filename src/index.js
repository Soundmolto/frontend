import { Component } from 'preact';
import { Provider, connect } from 'preact-redux';
import { HotKeys } from 'react-hotkeys';
import { TRACK } from './enums/track'
import { SETTINGS } from './enums/settings'
import App from './components/App';
import store from './store';
import { shortcuts } from './shortcuts';
import './style';
import { WS_ENDPOINT } from './api';
import { NOTIFICATIONS } from './enums/notifications';

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

		const ws = new WebSocket(`${WS_ENDPOINT}`);

		ws.addEventListener('message', (event) => {
			const { token } = store.getState().auth;
			const message = JSON.parse(event.data);

			switch (message.type) {
				case "Authorization": {
					if (message["Authorization-Begin"] === "TokenRequired") {
						ws.send(
							JSON.stringify({
								type: "authentication",
								token
							})
						);
					}
					return;
				}

				case "notifications": {
					const notifications = message.notifications.sort((first, second) => parseInt(second.createdAt) - parseInt(first.createdAt));
					console.log(notifications);
					store.dispatch({ type: NOTIFICATIONS.GOT_NOTIFICATIONS, payload: notifications });
					return;
				}
			}
		});
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

import { Component } from 'preact';
import { Provider, connect } from 'preact-redux';
import { HotKeys } from 'react-hotkeys';
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
		'show:goto': 'ctrl+g'
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
		}
	};

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
			<App />
		</HotKeysHOC>
	</Provider>
);

export default Main;

import { Component } from 'preact';
import { Provider, connect } from 'preact-redux';
import { HotKeys } from 'react-hotkeys';
import App from './components/App';
import store from './store';
import './style';

class HotKeysHOC extends Component {
	map = {
		'show:settings': 'ctrl+,'
	};

	handlers = {
		'show:settings': e => {
			store.dispatch({
				type: "SHOW_SETTINGS_PANEL"
			})
		}
	};

	render ({ children }) {
		return (
			<HotKeys handlers={this.handlers} keyMap={this.map} autofocus={true}>
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

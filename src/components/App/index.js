import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { connect } from 'preact-redux';
import Header from '../Header';
import Footer from '../Footer';
import Home from 'async!../../routes/home';
import Profile from 'async!../../routes/profile';
import Login from 'async!../../routes/login';
import Users from 'async!../../routes/users';
import Register from 'async!../../routes/register';
import Track from 'async!../../routes/track';
import { request_new_data } from '../../actions/user';
import { THEMES } from '../../enums/themes';
import { QueueController } from '../QueueController';

let onRender = (UI) => {};
let MainAudioContext;
const queue = new QueueController();

if (typeof window !== "undefined") {
	onRender = (UI) => {
		if (UI.theme === THEMES.dark) {
			document.body.classList.add('mdc-theme--dark');
		} else {
			document.body.classList.remove('mdc-theme--dark');
		}
	};
	

	MainAudioContext = new (window.AudioContext || window.webkitAudioContext)();
}

@connect(state => state)
export default class App extends Component {

	footer = null;
	audioContext = MainAudioContext;

	componentDidMount () {
		const { auth, dispatch, user, UI } = this.props;
		if (auth.logged_in) {
			request_new_data(dispatch, { token: auth.token, vanity_url: user.profile.url })
		}
	}

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	get_current_route () {
		return this.currentUrl;
	}

	render ({ UI, store }) {
		const url = this.get_current_route.bind(this);

		onRender(UI);

		return (
			<div id="app">
				<Header get_url={url} />
				<div class="route-container">
					<Router onChange={this.handleRoute} class="ahh">
						<Home path="/" className="route-page" />
						<Login path="/login" key="login" className="route-page" />
						<Register path="/register" key="register" className="route-page" />
						<Users path="/users" className="route-page" />
						<Profile path="/:vanity_url" key="profile" audioContext={this.audioContext} queue={queue} store={store} class="route-page" />
						<Track path="/:vanity_url/:track_url" key="track" audioContext={this.audioContext} queue={queue} class="route-page" />
					</Router>
				</div>
				<Footer ref={e => (this.footer = e)} audioContext={this.audioContext} queue={queue} />
			</div>
		);
	}
}

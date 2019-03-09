import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { connect } from 'preact-redux';
import ReactGA from 'react-ga';
import Header from '../Header';
import Footer from '../Footer';
import Home from 'async!../../routes/home';
import Profile from 'async!../../routes/profile';
import Login from 'async!../../routes/login';
import Users from 'async!../../routes/users';
import Register from 'async!../../routes/register';
import Track from 'async!../../routes/track';
import Admin from 'async!../../routes/admin';
import TrackCollection from 'async!../../routes/track-collection';
import { request_new_data } from '../../actions/user';
import { THEMES } from '../../enums/themes';
import { QueueController } from '../QueueController';
import Following from '../../routes/artists';
import Stats from '../../routes/stats';
import PrivacyPolicy from '../../routes/privacy-policy';
import { WebAudioPlayer } from '../WebAudioPlayer/WebAudioPlayer';
import Playlist from '../../routes/playlist';

let onRender = (UI) => {};
let MainAudioContext;
const queue = new QueueController();

if (typeof window !== "undefined") {
	onRender = (UI, auth) => {
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

	constructor (opts) {
		super(opts);
		this.player = new WebAudioPlayer({ audioContext: MainAudioContext });
		window.__webAudioPlayer = this.player;
	}
	
	componentDidMount () {
		ReactGA.initialize('UA-125828388-1');
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
		ReactGA.pageview(window.location.pathname + window.location.search);
		const event = new Event('url-change');
		window.document.dispatchEvent(event);
	};

	get_current_route () {
		return this.currentUrl;
	}

	render ({ auth, UI, store }) {
		const url = this.get_current_route.bind(this);

		onRender(UI, auth);

		return (
			<div id="app">
				<Header get_url={url} ref={e => this.header = e} />
				<div class="route-container">
					<Router onChange={this.handleRoute}>
						<Home path="/" className="route-page" queue={queue} onShareTrack={track => this.header._component.openShareTrack(track)} />
						<Login path="/login" key="login" className="route-page" />
						<Register path="/register" key="register" className="route-page" />
						<Admin path="/admin" className="route-page" />
						<Users path="/users" className="route-page" />
						<Playlist path="/playlist/:playlistID" className="route-page" audioContext={this.audioContext} queue={queue} />
						<Profile path="/:vanity_url" key="profile" audioContext={this.audioContext} queue={queue} store={store} class="route-page" onShareTrack={track => this.header._component.openShareTrack(track)} />
						<Track path="/:vanity_url/:track_url" key="track" audioContext={this.audioContext} queue={queue} class="route-page" onShareTrack={track => this.header._component.openShareTrack(track)} />
						<TrackCollection path="/collection/tracks" key="track-collection" audioContext={this.audioContext} queue={queue} class="route-page" />
						<Following path="/:vanity_url/following" className="route-page" />
						<Stats path="/you/stats" className="route-page" />
						<PrivacyPolicy path="/privacy-policy" className="route-page" />
						<Stats path="/terms-of-use" className="route-page" />
					</Router>
				</div>
				<Footer ref={e => (this.footer = e)} audioContext={this.audioContext} queue={queue} audioPlayer={this.player} />
			</div>
		);
	}
}

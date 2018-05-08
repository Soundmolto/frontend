import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { connect } from 'preact-redux';
import Header from '../Header';
import Footer from '../Footer';
import Home from 'async!../../routes/home';
import Profile from 'async!../../routes/profile';
import MyProfile from 'async!../../routes/my-profile';
import Login from 'async!../../routes/login';
import Users from 'async!../../routes/users';
import Register from 'async!../../routes/register';
import Helmet from 'preact-helmet';
import { request_new_data } from '../../actions/user';
import { THEMES } from '../../enums/themes';

let onRender = (UI) => {};
let MainAudioContext;

if (typeof window !== "undefined") {
	onRender = (UI) => {
		if (UI.theme === THEMES.dark) {
			document.body.classList.add('mdc-theme--dark');
		} else {
			document.body.classList.remove('mdc-theme--dark');
		}
	};

	MainAudioContext = new AudioContext();
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

	render ({ UI }) {
		const url = this.get_current_route.bind(this);

		onRender(UI);

		return (
			<div id="app">
				<Header get_url={url} />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Login path="/login" key="login" />
					<Register path="/register" key="register" />
					<Users path="/users" />
					{/* 
						For the sake of simplicity during dev of alpha, this was setup as 2 routes.
						We should look at re-merging these routes in the future.
					*/}
					<MyProfile path="/me" key="my-profile" footer={this.footer} audioContext={this.audioContext} />
					<Profile path="/:vanity_url" key="profile" footer={this.footer} audioContext={this.audioContext} />
				</Router>
				<Footer ref={e => (this.footer = e)} audioContext={this.audioContext} />
			</div>
		);
	}
}

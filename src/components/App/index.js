import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { connect } from 'preact-redux';
import Header from '../Header';
import Home from 'async!../../routes/home';
import Profile from 'async!../../routes/profile';
import Login from 'async!../../routes/login';
import Users from 'async!../../routes/users';
import Helmet from 'preact-helmet';
import { request_new_data } from '../../actions/user';
import { THEMES } from '../../enums/themes';

@connect(state => state)
export default class App extends Component {

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

		if (UI.theme === THEMES.dark) {
			document.body.classList.add('mdc-theme--dark');
		} else {
			document.body.classList.remove('mdc-theme--dark');
		}

		return (
			<div id="app">
				<Header get_url={url} />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Profile path="/me/" />
					<Login path="/login" />
					<Users path="/users" />
					<Profile path="/:vanity_url" />
				</Router>
			</div>
		);
	}
}

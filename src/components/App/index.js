import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { connect } from 'preact-redux';
import Header from '../header';
import Home from 'async!../../routes/home';
import Profile from 'async!../../routes/profile';
import Login from 'async!../../routes/login';
import Users from 'async!../../routes/users';
import Footer from '../Footer';
import Helmet from 'preact-helmet';
import { request_new_data } from '../../actions/user';

@connect(state => state)
export default class App extends Component {

	componentDidMount () {
		const { auth, dispatch, user } = this.props;
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

	render () {
		const url = this.get_current_route.bind(this);
		return (
			<div id="app">
				{/* <Helmet link={
					[
						{rel: "stylesheet", href: "//fonts.googleapis.com/icon?family=Material+Icons"}
					]
				} /> */}
				<Header get_url={url} />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
					<Login path="/login" />
					<Users path="/users" />
				</Router>
				<Footer />
			</div>
		);
	}
}

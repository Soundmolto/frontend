import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { connect } from 'preact-redux';
import Header from '../header';
import Home from 'async!../../routes/home';
import Profile from 'async!../../routes/profile';
import Login from 'async!../../routes/login';

@connect(state => state)
export default class App extends Component {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render () {
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
					<Login path="/login" />
				</Router>
			</div>
		);
	}
}

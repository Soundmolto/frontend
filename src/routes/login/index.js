import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import Card from 'preact-material-components/Card';
import TextField from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import LinearProgress from 'preact-material-components/LinearProgress';
import 'preact-material-components/LinearProgress/style.css';
import { begin_login, login } from '../../actions/login';
import { route } from 'preact-router';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/TextField/style.css';
import style from './style';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';
import { generateTwitterCard } from '../../utils/generateTwitterCard';

/**
 * The login page / component
 */
@connect(({ auth }) => auth)
export default class Login extends Component {

	__state = { email: '', password: '' };

	/**
	 * When the user submits the login form.
	 * 
	 * TODO;
	 * - Handle validation
	 * - Hook up actions
	 * 
	 * @param {Event} e - The submit event.
	 */
	async onLogin (e) {
		e.preventDefault();
		const { dispatch } = this.props;
		/** This will update the UI to indicate we're logging in */
		dispatch(begin_login());
		/** This will update our state to indicate we've either logged in or failed login */
		login(this.__state, dispatch, _ => this.__state = {});
	}

	/**
	 * When the email changes, update our private state.
	 * 
	 * @param {Event|Object} event - The change event
	 */
	onEmailChange (event) {
		this.__state = Object.assign({}, this.__state, {  email: event.currentTarget.value || "" });
	}

	/**
	 * When the password changes, update our private state.
	 * 
	 * @param {Event|Object} event - The change event
	 */
	onPasswordChange (event) {
		this.__state = Object.assign({}, this.__state, { password: event.currentTarget.value || "" });
	}

	render ({ loading, logged_in, error, errorMessage }) {
		if (logged_in === true) route("/", true);

		return (
			<div class="login">
				<Helmet
					title={`${APP.NAME} - Login`}
					meta={generateTwitterCard({
						summary: `${APP.NAME} - Login`,
						site: `${APP.TWITTER_HANDLE}`,
						title: `${APP.NAME} - Login`,
						description: `${APP.NAME} Login page`,
						image: `https://app.soundmolto.com/assets/icons/android-chrome-512x512.png`,
					})}
				/>
				<div class="header">
					<h1>Login</h1>
				</div>
				<div class={style.home}>
					<form class={style.cardBody} onSubmit={this.onLogin.bind(this)} key="login-form">
						<TextField
							name="login_email"
							label="Enter your email address"
							type="email"
							autofocus
							onChange={this.onEmailChange.bind(this)}
							onBlur={this.onEmailChange.bind(this)}
							key="login-email"
							value={this.__state.email}
						/>
						<TextField name="login_password" type="password" label="Enter a password" onChange={this.onPasswordChange.bind(this)} onBlur={this.onPasswordChange.bind(this)} key="login-password" value={this.__state.password} />
						<div className={style.buttonContainer}>
							<Button raised onClick={this.onLogin.bind(this)} type="submit" class={style.button}>
								{!logged_in && !loading && "Login"}
								{!logged_in && loading && <LinearProgress reversed={true} indeterminate={true} />}
							</Button>
							{error && errorMessage != null && <div className="error-message">{errorMessage}</div>}
						</div>
					</form>
				</div>
			</div>
		);
	}
}

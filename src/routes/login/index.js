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

// State outside of the component.
let state = { email: '', password: '' };

/**
 * The login page / component
 */
@connect(({ auth }) => auth)
export default class Login extends Component {

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
		login(state, dispatch, _ => state = {});
	}

	/**
	 * When the email changes, update our private state.
	 * 
	 * @param {Event|Object} event - The change event
	 */
	onEmailChange (event) {
		state = Object.assign({}, state, {  email: event.currentTarget.value || "" });
	}

	/**
	 * When the password changes, update our private state.
	 * 
	 * @param {Event|Object} event - The change event
	 */
	onPasswordChange (event) {
		state = Object.assign({}, state, { password: event.currentTarget.value || "" });
	}

	render ({ loading, logged_in, error, errorMessage }) {
		if (logged_in === true) route("/", true);

		return (
			<div>
				<Helmet title={`${APP.NAME} - Login`} />
				<div class="header">
					<h1>Login</h1>
				</div>
				<div class={style.home}>
					<Card className={style.card}>
						<form class={style.cardBody} onSubmit={this.onLogin.bind(this)} key="login-form">
							<TextField name="login_email" label="Enter your email address" type="email" autofocus onChange={this.onEmailChange.bind(this)} onBlur={this.onEmailChange.bind(this)} key="login-email" value="" />
							<TextField name="login_password" type="password" label="Enter a password" onChange={this.onPasswordChange.bind(this)} onBlur={this.onPasswordChange.bind(this)} key="login-password"  value="" />
							<div className={style.buttonContainer}>
								<Button raised onClick={this.onLogin.bind(this)} type="submit">
									{!logged_in && !loading && "Login"}
									{!logged_in && loading && <LinearProgress reversed={true} indeterminate={true} />}
								</Button>
								{error && errorMessage != null && <div className="error-message">{errorMessage}</div>}
							</div>
						</form>
					</Card>
				</div>
			</div>
		);
	}
}

import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import TextField from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import LinearProgress from 'preact-material-components/LinearProgress';
import 'preact-material-components/LinearProgress/style.css';
import { begin_login, login, facebook_login } from '../../actions/login';
import { route } from 'preact-router';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/TextField/style.css';
import style from './style';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';
import { generateTwitterCard } from '../../utils/generateTwitterCard';
import { facebookConfig } from '../../config/facebook';

let hasFocused = false;

/**
 * The login page / component
 */
@connect(({ auth }) => auth)
export default class Login extends Component {

	__state = { email: '', password: '' };
	state = { allowFacebook: false };

	componentDidUpdate () {
		if (this.state.allowFacebook) {
			window.fbAsyncInit = () => {
				FB.init(facebookConfig);
				const fields = 'first_name,last_name,email,picture';

				FB.Event.subscribe('auth.login', response => {
					if (response.status === "connected") {
						FB.api('/me', { fields }, response => this.loginWithFacebook(response));
					}
				});

				FB.getLoginStatus(response => {
					if (response.status === "connected") {
						FB.api('/me', { fields }, response => this.loginWithFacebook(response));
					}
				});
			};

			(function(d, s, id){
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {return;}
				js = d.createElement(s); js.id = id;
				js.src = "https://connect.facebook.net/en_US/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		}
	}

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

	onFocus = e => {
		const element = e.target;
		window.setTimeout(() => {
			hasFocused = true;
			element.scrollIntoView({ behavior: "smooth" });
		}, hasFocused ? 16 : 128);
	}

	onPasswordBlur = (e) => {
		hasFocused = false;
		this.onPasswordChange(e);
	}

	onEmailBlur = (e) => {
		hasFocused = false;
		this.onEmailChange(e);
	}

	loginWithFacebook (profile) {
		const { dispatch } = this.props;
		/** This will update our state to indicate we've either logged in or failed login */
		facebook_login(profile, dispatch, _ => {
			this.__state = {};
			this.setState({ allowFacebook: false });
		});
	}

	render ({ loading, logged_in, error, errorMessage }, { allowFacebook }) {
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
							onBlur={this.onEmailBlur}
							key="login-email"
							value={this.__state.email}
							onFocus={this.onFocus}
							id="email"
						/>
						<TextField
							name="login_password"
							type="password"
							label="Enter a password"
							onChange={this.onPasswordChange.bind(this)}
							onBlur={this.onPasswordBlur}
							key="login-password"
							value={this.__state.password}
							onFocus={this.onFocus}
							id="password"
						/>
						<div className={style.buttonContainer}>
							<Button raised onClick={this.onLogin.bind(this)} type="submit" class={style.button}>
								{!logged_in && !loading && "Login"}
								{!logged_in && loading && <LinearProgress reversed={true} indeterminate={true} />}
							</Button>
							{error && errorMessage != null && <div className="error-message">{errorMessage}</div>}
						</div>

						<div class={style['line-center-container']}>
							<span class={style['line-center']}>OR</span>
						</div>

						{allowFacebook ? (
							<div id="spinner" class={style.fbLoader}>
								<div
									class={`fb-login-button ${style.fbButton}`}
									data-max-rows="1"
									data-size="large"
									data-button-type="login_with"
									data-auto-logout-link="true"
									scope="public_profile,email"
								></div>
							</div>
						) : (
							<div class={style.facebookButton} onClick={() => this.setState({ allowFacebook: true })}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 216 216" class="_5h0m" color="#FFFFFF">
									<path fill="#FFFFFF" d="
										M204.1 0H11.9C5.3 0 0 5.3 0 11.9v192.2c0 6.6 5.3 11.9 11.9
										11.9h103.5v-83.6H87.2V99.8h28.1v-24c0-27.9 17-43.1 41.9-43.1
										11.9 0 22.2.9 25.2 1.3v29.2h-17.3c-13.5 0-16.2 6.4-16.2
										15.9v20.8h32.3l-4.2 32.6h-28V216h55c6.6 0 11.9-5.3
										11.9-11.9V11.9C216 5.3 210.7 0 204.1 0z"
									></path>
								</svg>
								Allow Facebook login?
							</div>
						)}
					</form>
				</div>
			</div>
		);
	}
}

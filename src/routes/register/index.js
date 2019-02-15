import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import Checkbox from 'preact-material-components/Checkbox';
import TextField from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import LinearProgress from 'preact-material-components/LinearProgress';
import { begin_register, register } from '../../actions/register';
import { route } from 'preact-router';
import 'preact-material-components/LinearProgress/style.css';
import 'preact-material-components/Checkbox/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/TextField/style.css';
import style from './style';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';
import { generateTwitterCard } from '../../utils/generateTwitterCard';
import Formfield from 'preact-material-components/FormField';
import { facebookConfig } from '../../config/facebook';
import { facebook_login } from '../../actions/login';

// State outside of the component.
let _state = {};

/**
 * The login page / component
 */
@connect(({ auth }) => auth)
export default class Login extends Component {

	state = {
		error: false,
		errorMessage: '',
		allowFacebook: false
	};

	componentDidUpdate () {
		if (this.state.allowFacebook) {
			window.fbAsyncInit = () => {
				FB.init(facebookConfig);
				const fields = 'first_name,last_name,email,picture';

				FB.Event.subscribe('auth.login', response => {
					if (response.status === "connected") {
						FB.api('/me', { fields }, profile => this.loginWithFacebook(profile, response));
					}
				});

				FB.getLoginStatus(response => {
					if (response.status === "connected") {
						FB.api('/me', { fields }, profile => this.loginWithFacebook(profile, response));
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

	validate () {
		let valid = true;

		if (_state.password == null) {
			this.setState({ error: true, errorMessage: 'Password must set.' });
			valid = false;
		}
		if (_state.password.length < 8) {
			this.setState({ error: true, errorMessage: 'Password must be longer than 8 characters.' });
			valid = false;
		} 
		
		if (valid === true) {
			this.setState({ error: false, errorMessage: '' });
		}

		return valid;
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
	async onRegister (e) {
		if (e.target.disabled) return;
		e.preventDefault();
		const { dispatch } = this.props;
		if (this.validate()) {
			/** This will update the UI to indicate we're logging in */
			dispatch(begin_register());
			/** This will update our state to indicate we've either logged in or failed login */
			register(_state, dispatch, _ => state = {});
		}
	}

	/**
	 * When the email changes, update our private state.
	 * 
	 * @param {Event|Object} event - The change event
	 */
	onEmailChange (event) {
		_state = {..._state, email: event.currentTarget.value || ""};
	}

	/**
	 * When the password changes, update our private state.
	 * 
	 * @param {Event|Object} event - The change event
	 */
	onPasswordChange (event) {
		_state = {..._state, password: event.currentTarget.value || ""};
	}

	shouldComponentUpdate () {
		return true;
	}

	onChangeTermsOfUse = e => {
		const checked = e.target.checked;

		this.setState({ acceptedTerms: checked });
	}

	routeTo = (e, url) => {
		e.preventDefault();
		route(url);
	}

	loginWithFacebook (profile, res) {
		console.log(res, profile);
		const { dispatch } = this.props;
		/** This will update our state to indicate we've either logged in or failed login */
		facebook_login({
			...profile,
			accessToken: res.authResponse.accessToken
		}, dispatch, _ => {
			this.__state = {};
			this.setState({ allowFacebook: false });
		});
	}

	render ({ loading, logged_in, error, errorMessage }, state) {
		if (logged_in === true) route("/", true);
		let otherProps = {};

		if (!state.acceptedTerms) {
			otherProps.disabled = true;
		}

		return (
			<div class="register">
				<Helmet
					title={`${APP.NAME} - Register`}
					meta={generateTwitterCard({
						summary: `${APP.NAME} - Register`,
						site: `${APP.TWITTER_HANDLE}`,
						title: `${APP.NAME} - Register`,
						description: `${APP.NAME} Register page`,
						image: `https://app.soundmolto.com/assets/icons/android-chrome-512x512.png`,
					})}
				/>
				<div class="header">
					<h1>Register</h1>
				</div>
				<div class={style.home}>
					<form class={style.cardBody} onSubmit={this.onRegister.bind(this)} key={"registration-form"}>
						<TextField label="Enter your email address" type="email" autofocus onChange={this.onEmailChange.bind(this)} key="registration-email" name="email" id="email" />
						<TextField type="password" label="Enter a password" onChange={this.onPasswordChange.bind(this)} key="registration-password" name="password" id="password" />
						<Formfield>
							<Checkbox id="terms-conditions" label="I accept the terms of use" onChange={this.onChangeTermsOfUse} />
							<label for="terms-conditions">
								I agree to the <a target="_blank" href='/terms-of-use' onClick={e => this.routeTo(e, '/terms-of-use')}>Terms of use</a> and <a target="_blank" href='/privacy-policy' onClick={e => this.routeTo(e, '/privacy-policy')}>Privacy policy</a>
							</label>
						</Formfield>
						<div className={style.buttonContainer}>
							<Button raised onClick={this.onRegister.bind(this)} type="submit" class={style.button} {...otherProps}>
								{!logged_in && !loading && "Register"}
								{!logged_in && loading && <LinearProgress reversed={true} indeterminate={true} />}
							</Button>
							{error && errorMessage != null && <div className="error-message">{errorMessage}</div>}
							{state.error && state.errorMessage != null && <div className="error-message">{state.errorMessage}</div>}
						</div>

						<div class={style['line-center-container']}>
							<span class={style['line-center']}>OR</span>
						</div>

						{state.allowFacebook ? (
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

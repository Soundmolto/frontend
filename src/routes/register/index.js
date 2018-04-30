import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import Card from 'preact-material-components/Card';
import TextField from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import LinearProgress from 'preact-material-components/LinearProgress';
import 'preact-material-components/LinearProgress/style.css';
import { begin_register, register } from '../../actions/register';
import { route } from 'preact-router';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/TextField/style.css';
import style from './style';

// State outside of the component.
let state = {};

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
		dispatch(begin_register());
		/** This will update our state to indicate we've either logged in or failed login */
		register(state, dispatch, _ => state = {});
	}

	/**
	 * When the email changes, update our private state.
	 * 
	 * @param {Event|Object} event - The change event
	 */
	onEmailChange (event) {
		state = {...state, email: event.currentTarget.value || ""};
	}

	/**
	 * When the password changes, update our private state.
	 * 
	 * @param {Event|Object} event - The change event
	 */
	onPasswordChange (event) {
		state = {...state, password: event.currentTarget.value || ""};
	}

	render ({ loading, logged_in, error, errorMessage }) {
		if (logged_in === true) route("/", true);

		return (
			<div>
				<div class="header">
					<h1>Register</h1>
				</div>
				<div class={style.home}>
					<Card className={style.card}>
						<form class={style.cardBody} onSubmit={this.onLogin.bind(this)}>
							<TextField label="Enter your email address" type="email" autofocus onChange={this.onEmailChange.bind(this)} key="registration-email" />
							<TextField type="password" label="Enter a password" onChange={this.onPasswordChange.bind(this)} key="registration-password" />
							<div className={style.buttonContainer}>
								<Button raised onClick={this.onLogin.bind(this)} type="submit">
									{!logged_in && !loading && "Register"}
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

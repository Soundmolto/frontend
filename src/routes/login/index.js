import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import Card from 'preact-material-components/Card';
import TextField from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
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
	onLogin (e) {
		e.preventDefault();
		// Handle the login event with the current state
		console.log(
			state
		);
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

	render() {
		return (
			<div class={style.home}>
				<Card className={style.card}>
					<form class={style.cardBody} onSubmit={this.onLogin.bind(this)}>
						<TextField label="Enter your email address" type="email" autofocus onChange={this.onEmailChange.bind(this)} />
						<TextField type="password" label="Enter a password" onChange={this.onPasswordChange.bind(this)} />
						<div className={style.buttonContainer}>
							<Button raised onClick={this.onLogin.bind(this)} type="submit">Login</Button>
						</div>
					</form>
				</Card>
			</div>
		);
	}
}

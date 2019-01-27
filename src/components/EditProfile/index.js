import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import TextField from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import Goku from '../../assets/goku.png';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/LinearProgress/style.css';
import 'preact-material-components/FormField/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/TextField/style.css';
import styles from './style';
import { edit_profile } from '../../actions/profile';
import { API_ENDPOINT } from '../../api';
import { prefill_auth } from '../../prefill-authorized-route';
import { USER } from '../../enums/user';
import { onKeyDown } from '../../utils/onKeyDown';

const full_width = Object.freeze({ width: '100%' });

let state = { profile: {} };

/**
 * The login page / component
 */
@connect(({ user, auth }) => ({ user, auth }))
export default class EditProfile extends Component {

	state = { loading: false, loaded: true, error: null }
	
	get values () {
		return Object.assign({}, state);
	}

	onSubmit (e) {
		e.preventDefault();
		if (state.password === '' || state.password == null) delete state.password;

		if (state.password && (state.password != null || state.password != '') && state.password.length <= 7) {
			// handle error
			this.setState({ error: "Password must be atleast 8 characters long." });
			return;
		} else {
			this.setState({ error: null });
		}


		const id = this.props.user.id;
		edit_profile(this.props.dispatch, { token: this.props.auth.token, profile: { ...state }, id });
		if (this.props.onSubmit && this.state.loading === false) {
			this.props.onSubmit();
		}
		state.password = null;
		return true;
	}
	
	onDragOver (e) { 
		e.preventDefault(); 
	}

	onDrop (e) {
		e.preventDefault();
		this.onFileChange(e, e.dataTransfer.files[0]);
	}

	onInputChange (e, val) {
		const value = e.currentTarget.value;

		if (val === 'password' && (value !== '' || value != null)) {
			state.password = value;
		} else {
			let _opt = { [val]: value };
			state.profile = {...state.profile, ..._opt };
		}
	}

	async onFileChange(e, f) {
		const file = f || e.target.files[0];
		const data = new FormData();
		const { token } = this.props.auth;
		data.append('file', file, file.name);
		this.setState({ loading: true, loaded: false });
		let track = {};

		const post = await fetch(`${API_ENDPOINT}/users/${this.props.user.id}/profile-picture`, { method: "POST", headers: { ...prefill_auth(token) }, body: data });
		const payload = await post.json();

		this.props.dispatch({ type: USER.HAS_NEW_DATA, payload });

		this.setState({ loaded: true, loading: false })
	}

	render ({ user }, { loading, loaded, error }) {
		state.profile = Object.assign({}, user.profile);
		return (
			<form onSubmit={this.onSubmit.bind(this)} class={styles.form}>
				<label className={`${styles['upload-image']} edit-profile-form`}
					onDragOver={this.onDragOver.bind(this)}
					onDrop={this.onDrop.bind(this)}
					>
					<img src={user.profile.profilePicture || Goku} />
					<Icon class={styles.icon}>cloud_upload</Icon>
					<input type="file" accept="image/*" onChange={this.onFileChange.bind(this)} />
				</label>
				<TextField label="Your display name" type="text" autofocus value={user.profile.displayName} style={full_width} onChange={e => this.onInputChange(e, 'displayName')} className={styles.username} />
				<TextField label="Your profile URL" type="text" value={user.profile.url} style={full_width} onChange={e => this.onInputChange(e, 'url')} onKeyDown={onKeyDown} />
				<TextField label="Your location" type="text" value={user.profile.location} style={full_width} onChange={e => this.onInputChange(e, 'location')} />
				<TextField label="Description" textarea value={user.profile.description} style={full_width} onChange={e => this.onInputChange(e, 'description')} />
				<TextField label="Password" type="password" value={state.password || undefined} style={full_width} onChange={e => this.onInputChange(e, 'password')} />
				{error != null && <div className="error-message">{error}</div>}
				<Button class={styles.button} type="submit">Submit</Button>
			</form>
		);
	}
}

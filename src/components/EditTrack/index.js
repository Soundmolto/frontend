import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import Goku from '../../assets/goku.png';
import TextField from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/LinearProgress/style.css';
import 'preact-material-components/FormField/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/TextField/style.css';
import styles from './style';
import { edit_track } from '../../actions/track';
import { API_ENDPOINT } from '../../api';
import { prefill_auth } from '../../prefill-authorized-route';
import { USER } from '../../enums/user';

const full_width = Object.freeze({ width: '100%' });

let state = {};

/**
 * The login page / component
 */
@connect(({ auth }) => ({ auth }))
export class EditTrack extends Component {
	
	get values () {
		return Object.assign({}, state);
	}

	onSubmit (e) {
		e.preventDefault();
		const id = this.props.track.id;
		edit_track(this.props.dispatch, { token: this.props.auth.token, track: { ...state }, id });
		if (this.props.onSubmit) {
			this.props.onSubmit();
		}
		return true;
	}

	onInputChange (e, val) {
		let value = e.currentTarget.value;
		if (val === 'url') {
			value = value.split(' ').join('-');
			e.currentTarget.value = value;
		}
		let _opt = { [val]: value };
		state = {...state, ..._opt };
	}

	onDragOver (e) { 
		e.preventDefault(); 
	}

	onDrop (e) {
		e.preventDefault();
		this.onFileChange(e, e.dataTransfer.files[0]);
	}

	async onFileChange(e, f) {
		const file = f || e.target.files[0];
		const data = new FormData();
		const { token } = this.props.auth;
		data.append('file', file, file.name);
		this.setState({ loading: true, loaded: false });
		let track = {};

		const post = await fetch(`${API_ENDPOINT}/tracks/${this.props.track.id}/artwork`, { method: "POST", headers: { ...prefill_auth(token) }, body: data });
		const payload = await post.json();

		this.props.dispatch({ type: USER.HAS_NEW_DATA, payload });

		this.setState({ loaded: true, loading: false })
	}

	onKeyDown (e) {
		console.log(e.key);
		if (e.key === 'Space' || e.key === ' ') {
			e.preventDefault();
		}
	}

	render ({ track }) {
		state = Object.assign({}, track);
		// console.log(track);
		return (
			<form onSubmit={this.onSubmit.bind(this)} class={styles.form}>
				<label className={styles['upload-image']}
					onDragOver={this.onDragOver.bind(this)}
					onDrop={this.onDrop.bind(this)}
					>
					<img src={track.artwork || Goku} />
					<Icon class={styles.icon}>cloud_upload</Icon>
					<input type="file" accept="image/*" onChange={this.onFileChange.bind(this)} />
				</label>
				<TextField label="Track name" type="text" autofocus value={track.name} style={full_width} onChange={e => this.onInputChange(e, 'name')} class={styles['track-name']} />
				<TextField label="Track URL" type="text" autofocus value={track.url} style={full_width} onChange={e => this.onInputChange(e, 'url')} onKeyDown={this.onKeyDown.bind(this)} />
				<Button type="submit">Submit</Button>
			</form>
		);
	}
}

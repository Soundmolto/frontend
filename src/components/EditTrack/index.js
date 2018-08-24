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
import { onKeyDown } from '../../utils/onKeyDown';

const full_width = Object.freeze({ width: '100%' });

/**
 * The login page / component
 */
@connect(({ auth }) => ({ auth }))
export class EditTrack extends Component {

	localState = {};
	
	get values () {
		return Object.assign({}, this.localState);
	}

	onSubmit (e) {
		e.preventDefault();
		const id = this.props.track.id;
		edit_track(this.props.dispatch, { token: this.props.auth.token, track: { ...this.localState }, id });

		if (this.props.onSubmit) {
			this.props.onSubmit(this.localState);
		}
		this.localState = {};
		return true;
	}

	ensureURLSafeCharacters (value) {
		let r = value.split(' ').join('-');
		return r;
	}

	onInputChange (e, val) {
		let value = e.currentTarget.value;
		if (val === 'url') {
			value = this.ensureURLSafeCharacters(value);
			e.currentTarget.value = value;
		}
		let _opt = { [val]: value };
		this.localState = {...this.localState, ..._opt };
	}

	onDragOver (e) { 
		e.preventDefault(); 
	}

	onDrop (e) {
		e.preventDefault();
		this.onFileChange(e, e.dataTransfer.files[0]);
	}

	async onFileChange (e, f) {
		const file = f || e.target.files[0];
		const data = new FormData();
		const { auth, track } = this.props;
		const { token } = auth;
		data.append('file', file, file.name);
		this.setState({ loading: true, loaded: false });

		const post = await fetch(`${API_ENDPOINT}/tracks/${track.id}/track-artwork`, { method: "POST", headers: { ...prefill_auth(token) }, body: data });
		const payload = await post.json();

		this.props.dispatch({ type: USER.HAS_NEW_DATA, payload });

		this.setState({ loaded: true, loading: false })
	}

	render ({ track }) {
		this.localState = Object.assign({}, track);
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
				<TextField class={styles['track-name']} label="Track name" type="text" autofocus value={track.name} style={full_width} onChange={e => this.onInputChange(e, 'name')} />
				<TextField label="Track URL" type="text" value={track.url} style={full_width} onChange={e => this.onInputChange(e, 'url')} onKeyDown={onKeyDown} />
				<TextField textarea label="Track description" value={track.description} style={full_width} onChange={e => this.onInputChange(e, 'description')} />
				<Button type="submit">Submit</Button>
			</form>
		);
	}
}

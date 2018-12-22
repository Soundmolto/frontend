import { Component } from "preact";
import style from './style';
import Icon from 'preact-material-components/Icon';
import LinearProgress from 'preact-material-components/LinearProgress';
import { API_ENDPOINT } from "../../api";
import { prefill_auth } from "../../prefill-authorized-route";
import { connect } from "preact-redux";
import { USER } from "../../enums/user";
import { EditTrack } from "../EditTrack";

const get_default_state = () => Object.assign({}, { imageSrc: '', loaded: false, loading: false, editing: false, track_editing: null });

@connect(({ auth }) => ({ auth }))
export class UploadTrack extends Component {

	state = get_default_state();

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
		const { token } = this.props.auth;
		data.append('file', file, file.name);
		this.setState({ loading: true });
		let track = {};

		const post = await fetch(`${API_ENDPOINT}/tracks`, { method: "POST", headers: { ...prefill_auth(token) }, body: data });
		const payload = await post.json();

		this.props.dispatch({ type: USER.HAS_NEW_DATA, payload: payload.user });

		for (const id of payload.created) {
			const filtered = payload.user.tracks.filter(_track => _track.id === id);
			if (filtered.length >= 1) track = filtered[0];
		}

		this.setState({ loaded: true, loading: false, editing: true, track_editing: track })
	}

	render (props, { loading, editing, track_editing }) {
		let className = `${style.uploader} ${style.center}`;

		return (
			<div class={style.root}>
				{loading === false && editing === false && (
					<label className={className}
						onDragOver={this.onDragOver.bind(this)}
						onDrop={this.onDrop.bind(this)}>
						
						<img className={style.loaded}/>
						<Icon class={style.icon}>cloud_upload</Icon> Upload Track
						<input type="file" accept="audio/*" onChange={this.onFileChange.bind(this)} />
					</label>
				)}
				{loading === true && editing === false && (
					<LinearProgress indeterminate={true} />
				)}
				{loading === false && editing === true && (
					<EditTrack track={track_editing} onSubmit={e => this.setState(get_default_state())} />
				)}

				<p class={style.maxFileSize}>Max file size is 5GB.</p>
			
			</div>
		);
	}

}

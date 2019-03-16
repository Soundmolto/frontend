import { Component } from "preact";
import { connect } from "preact-redux";
import Dialog from "preact-material-components/Dialog";
import { TextFieldInput } from "preact-material-components/TextField";
import 'preact-material-components/TextField/style.css';
import styles from './styles.css';
import Button from "preact-material-components/Button";
import { update_playlist, create_playlist } from "../../actions/playlist";
import store from "../../store";

@connect(({ auth }) => ({ auth }))
export class EditPlaylist extends Component {

	state = {
		name: '',
		description: ''
	};

	editPlaylistRef = e => this.editPlaylist = e;

	onCancel = () => {
		if (this.props.onCancel) {
			this.props.onCancel();
		}
	}

	componentDidMount () {
		let name = '';
		let description = '';

		if (this.props.playlist) {
			name = this.props.playlist.name;
			description = this.props.playlist.description;
		}

		this.setState({ name, description });
		this.editPlaylist.MDComponent.show();
	}

	onChangeName = e => this.setState({ name: e.target.value });
	onChangeDescription = e => this.setState({ description: e.target.value });
	onSubmit = async e => {
		const { token } = this.props.auth;
		const { name, description } = this.state;
		if (e.preventDefault) {
			e.preventDefault();
		}

		if (this.props.create) {
			await create_playlist(store.dispatch, { token, name, description });
		} else {
			const { id } = this.props.playlist;
			await update_playlist(store.dispatch, { id, token, name, description });
		}

		this.editPlaylist.MDComponent.close();
		if (this.props.onAccept) {
			this.props.onAccept();
		}
	}

	render (props, { name = '', description = '' }) {
		return (
			<Dialog ref={this.editPlaylistRef} onCancel={this.onCancel} open={true}>
				<div class="modal-border-top"></div>
				<Dialog.Header>Edit Playlist</Dialog.Header>
				<Dialog.Body>
					<form onSubmit={this.onSubmit}>
						<TextFieldInput type={'text'} label="Playlist Name" value={name} onChange={this.onChangeName} className={styles.input} />
						<TextFieldInput type={'text'} label="Playlist Description" value={description} onChange={this.onChangeDescription} className={styles.input} />
						<Button
							ripple={true}
							className={`${styles.input} ${styles.button}`}
							onClick={this.onSubmit}
						>
							Save
						</Button>
					</form>
				</Dialog.Body>
			</Dialog>
		)
	}
}
import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import TextField from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import LinearProgress from 'preact-material-components/LinearProgress';
import FormField from 'preact-material-components/FormField';
import 'preact-material-components/LinearProgress/style.css';
import 'preact-material-components/FormField/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/TextField/style.css';
import styles from './style';
import { edit_track } from '../../actions/track';

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
		return true;
	}

	onInputChange (e, val) {
		let _opt = { [val]: e.currentTarget.value };
		state = {...state, ..._opt };
	}

	render ({ track }) {
		state = Object.assign({}, track);
		return (
			<form onSubmit={this.onSubmit.bind(this)} class={styles.form}>
				<TextField label="Track name" type="text" autofocus value={track.name} style={full_width} onChange={e => this.onInputChange(e, 'name')} />
				<Button type="submit">Submit</Button>
			</form>
		);
	}
}

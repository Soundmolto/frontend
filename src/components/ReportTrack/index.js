import { Component } from "preact";
import style from './style';
import Icon from 'preact-material-components/Icon';
import { connect } from "preact-redux";
import { EditTrack } from "../EditTrack";

const get_default_state = () => Object.assign({}, { imageSrc: '', loaded: false, loading: false, editing: false, track_editing: null });

@connect(({ auth }) => ({ auth }))
export class ReportTrack extends Component {

	render () {
		let className = `${style.uploader} ${style.center}`;

		return (
			<div class={style.root}>aaa</div>
		);
	}

}

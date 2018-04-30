import { Component } from 'preact';
import { connect } from 'preact-redux';
import { THEMES } from '../../enums/themes';
import 'wavesurfer.js';
import Wavesurfer from 'react-wavesurfer';

@connect(({ UI }) => ({ UI }))
export class Waveform extends Component {

	constructor (props) {
		super(props);
		this.state = { playing: false, pos: 0 };
		this.handleTogglePlay = this.handleTogglePlay.bind(this);
		this.handlePosChange = this.handlePosChange.bind(this);
	}

	handleTogglePlay () {
		this.setState({ playing: !this.state.playing });
		console.log(this.state);
	}
	handlePosChange (e) {
		this.setState({ pos: e.originalArgs[0] });
	}

	render ({ data, UI }) {
		console.log(this.state.playing);
		return (
			<div onClick={this.handleTogglePlay.bind(this)}>
				<Wavesurfer
					audioFile={data.stream_url}
					pos={this.state.pos}
					onPosChange={this.handlePosChange}
					playing={this.state.playing}
					audioPeaks={data.peaks}
					options={{ waveColor: `#5D8CAE` }} />
			</div>
		)
	}
}

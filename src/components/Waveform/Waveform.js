import { Component } from 'preact';
import { THEMES } from '../../enums/themes';
import 'wavesurfer.js';
import Wavesurfer from 'react-wavesurfer';

export class Waveform extends Component {

	constructor (props) {
		super(props);
		this.state = { playing: false, pos: 0, mouseDown: false };
	}

	handleTogglePlay () {
		this.setState({ playing: !this.state.playing });
		if (this.props.onTogglePlay != null) {
			this.props.onTogglePlay(this.state.playing);
		}
	}

	handlePosChange (e) {
		this.setState({ pos: e.originalArgs[0] });
	}

	componentWillUnmount () {
		this.setState({ playing: false, pos: 0, mouseDown: false });
	}

	render ({ data, UI, onFinish }) {
		return (
			<div onClick={this.handleTogglePlay.bind(this)}>
				<Wavesurfer
					audioFile={data.stream_url}
					pos={this.state.pos}
					onPosChange={this.handlePosChange.bind(this)}
					playing={this.state.playing}
					audioPeaks={data.peaks}
					options={{ waveColor: `#5D8CAE`, progressColor: `#334b5c` }}
					onFinish={e => {
						this.setState({ playing: false });
						onFinish();
					}}
					onPlay={this.props.onStartPlay}
					/>
			</div>
		)
	}
}

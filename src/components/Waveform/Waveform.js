import { Component } from 'preact';
import { THEMES } from '../../enums/themes';
import 'wavesurfer.js';
import Wavesurfer from 'react-wavesurfer';

let linGrad = '#5D8CAE';
let linGradProgress = '#334b5c';

if (typeof window !== "undefined") {
	linGrad = document.createElement('canvas').getContext('2d').createLinearGradient(0, 0, 0, 250);
	linGrad.addColorStop(0, '#5D8CAE');
	linGrad.addColorStop(1, '#c67dcb');

	linGradProgress = document.createElement('canvas').getContext('2d').createLinearGradient(0, 0, 0, 250);
	linGradProgress.addColorStop(0, '#334b5c');
	linGradProgress.addColorStop(1, '#7b4180');
}

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
					options={{ waveColor: linGrad, progressColor: linGradProgress }}
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

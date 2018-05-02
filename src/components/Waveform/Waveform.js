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

	setState (state) {
		this._previousState = Object.assign({}, this.state);
		super.setState(state);
	}

	constructor (props) {
		super(props);
		this.state = { playing: false, pos: 0 };
		this._previousState = { playing: false, pos: 0 };
	}

	handleTogglePlay () {
		this.setState({ playing: !this.state.playing });
		if (this.props.onTogglePlay != null) {
			this.props.onTogglePlay(this.state.playing, this.state.pos);
		}
	}

	play () {
		if (false === this.state.playing) {
			this.setState({ playing: true });
			if (this.props.onTogglePlay != null) {
				this.props.onTogglePlay(this.state.playing, this.state.pos);
			}
		}
	}

	handlePosChange (e) {
		this.setState({ pos: e.originalArgs[0] });
		this.props.onPosChange(e.originalArgs[0]);
	}

	componentWillUnmount () {
		this.setState({ playing: false, pos: 0 });
	}

	onPause (e) {
		this.setState({ playing: false });
	}

	render ({ data, UI, onFinish }) {
		return (
			<div onClick={this.play.bind(this)}>
				<Wavesurfer
					ref={e => (this.waveSurfer = e)}
					audioFile={data.stream_url}
					pos={this.state.pos}
					onPosChange={this.handlePosChange.bind(this)}
					playing={this.state.playing}
					audioPeaks={data.peaks}
					options={{ waveColor: linGrad, progressColor: linGradProgress, barWidth: 1 }}
					onFinish={e => {
						this.setState({ playing: false });
						onFinish();
					}}
					onPlay={this.props.onStartPlay}
					key={'waveform-' + data.id}
					/>
			</div>
		)
	}
}

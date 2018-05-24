import { Component } from 'preact';
import { THEMES } from '../../enums/themes';
import { connect } from 'preact-redux';
import { SoundCloudWaveform } from './WaveformGenerator';
import store from '../../store';
import styles from './style.css';


let linGrad = '#5D8CAE';
let linGradProgress = '#334b5c';

if (typeof window !== "undefined") {
       linGrad = document.createElement('canvas').getContext('2d').createLinearGradient(0, 0, 0, 95);
       linGrad.addColorStop(0, '#5D8CAE');
       linGrad.addColorStop(1, '#c67dcb');

       linGradProgress = document.createElement('canvas').getContext('2d').createLinearGradient(0, 0, 0, 95);
       linGradProgress.addColorStop(0, '#334b5c');
       linGradProgress.addColorStop(1, '#7b4180');
}

export class Waveform extends Component {

	buffer = null;

	constructor (opts) {
		super(opts);
		let initialState = Object.assign({}, store.getState());
		if (typeof window !== "undefined") {
			window.addEventListener('resize', e => {
				this.removeCanvas();
				this.loadData();
			});

			store.subscribe(_ => {
				const state = Object.assign({}, store.getState());
				if (state.UI.theme !== initialState.UI.theme) {
					initialState = state;
					this.removeCanvas();
					this.loadData();
				}
			});
		}
	}

	componentDidMount() {
		this.loadData();
	}
	
	componentWillUpdate () {
		this.removeCanvas();
	}
	
	componentDidUpdate () {
		this.loadData();
	}
	
	loadData () {
		this.renderCanvas(this.props.data);
	}

	tryRemove (el) {
		try { el.remove(); } catch (e) {}
	}
	
	removeCanvas() {
		let containerEl = this.containerEl || document.querySelector(`.${styles.waveform}`);
		let timelineRoot = this.timelineRoot || document.querySelector(`.${styles['waveform-timeline--root']}`);
		if (containerEl) {
			let canvas = containerEl.querySelectorAll('canvas');
			let otherCanvas = timelineRoot.querySelectorAll('canvas');

			if (canvas) {
				for (let el of canvas) {
					this.tryRemove(el);
				}
			}

			if (otherCanvas) {
				for (let el of otherCanvas) {
					this.tryRemove(el);
				}
			}
		}
	}

	createCanvas (width) {
		let canvas = document.createElement('canvas');
		canvas.height = 60;
		canvas.width = width;
		return canvas;
	}

	renderCanvas (data) {
		const that = this;
		const { audioContext } = this.props;
		let j = 0;
		let containerEl = this.containerEl || document.querySelector(`.${styles.waveform}`);
		let timelineRoot = this.timelineRoot || document.querySelector(`.${styles['waveform-timeline--root']}`);

		const canvas = this.createCanvas(containerEl.parentElement.clientWidth);
		const timeline = this.createCanvas(timelineRoot.parentElement.clientWidth);

		const wave = new SoundCloudWaveform({
			canvas,
			bar_width: 2,
			bar_gap : 0.35,
			wave_color: linGrad,
			audioContext,
			onComplete (_buffer) {
				const tline = new SoundCloudWaveform({ canvas: timeline, bar_width: 2, bar_gap : 0.35, wave_color: linGradProgress, audioContext });
				if (that.buffer == null) {
					that.buffer = _buffer;
					tline.extractBuffer(_buffer);
				} else {
					tline.extractBuffer(that.buffer);
				}
			}
		});

		if (this.buffer == null) {
			wave.loadMusic(data.stream_url);
		} else {
			wave.extractBuffer(this.buffer);
		}

		containerEl.appendChild(canvas);
		timelineRoot.appendChild(timeline);

		window.__getContext = () => { return audioContext; };

		window.__playSong = () => {
			// Get an AudioBufferSourceNode.
			// This is the AudioNode to use when we want to play an AudioBuffer
			var source = audioContext.createBufferSource();
			var scriptNode = audioContext.createScriptProcessor(1024, 1, 1);

			// console.log(source, audioContext.buffer.duration)

			scriptNode.onaudioprocess = function(e) {
				timelineRoot.setAttribute('style', `width: ${audioContext.currentTime / source.buffer.duration * 100}%`)
				var output = e.outputBuffer.getChannelData(0);
				var input = e.inputBuffer.getChannelData(0);
				for (var i = 0; i < input.length; i++) {
					output[i] = input[i];
				}
			};

			// set the buffer in the AudioBufferSourceNode
			source.buffer = this.buffer;

			// connect the AudioBufferSourceNode to the
			// destination so we can hear the sound
			source.connect(scriptNode);
			scriptNode.connect(audioContext.destination);

			// start the source playing
			source.start(0);
		};
	}
	
	render ({ isCurrentTrack }) {
		return (
			<div class={styles.root}>
				<div class={`prel ${styles.container}`}>
					<div className={styles.waveform} ref={e => this.containerEl = e}></div>
					<div class={styles['waveform-timeline--root']} ref={e => this.timelineRoot = e}></div>
				</div>
			</div>
		);
	}
}

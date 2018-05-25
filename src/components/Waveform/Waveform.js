import { Component } from 'preact';
import { THEMES } from '../../enums/themes';
import { connect } from 'preact-redux';
import { WaveformGenerator } from './WaveformGenerator';
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
	subscribed = false;

	constructor (opts) {
		super(opts);
		let initialState = Object.assign({}, store.getState());
		if (typeof window !== "undefined") {
			window.addEventListener('resize', e => {
				this.loadData();
			});

			store.subscribe(_ => {
				const state = Object.assign({}, store.getState());

				if (state.UI.theme !== initialState.UI.theme) {
					initialState = state;
					this.loadData();
				}

				if (state.currently_playing.playing === true && state.currently_playing.track.id === this.props.data.id) {
					this.subscribed = true;
					window.document.querySelector('audio').addEventListener('timeupdate', this.onTimeUpdate.bind(this));
				}
			});
		}
	}

	onTimeUpdate (e) {
		const audio = window.document.querySelector('audio');
		const timelineRoot = this.timelineRoot || document.querySelector(`.${styles['waveform-timeline--root']}`);
		timelineRoot.setAttribute('style', `width: ${audio.currentTime / audio.duration * 100}%;`);
	}

	componentDidMount() {
		this.removeCanvas();
		this.loadData();
	}
	
	componentWillUpdate () {
		this.removeCanvas();
	}
	
	componentDidUpdate () {
		this.loadData();
	}
	
	loadData () {
		this.removeCanvas();
		this.renderCanvas(this.props.data);
	}

	tryRemove (el) {
		try { el.remove(); } catch (e) {}
	}
	
	removeCanvas () {
		const el = this.baseEl.querySelector(`.${styles.container}`);
		const allCanvas = el != null && el.querySelectorAll('canvas') || [];

		for (const _el of allCanvas) {
			try { _el.remove(); } catch (e) { console.log(e) }
		}
	}

	createCanvas (width) {
		let canvas = document.createElement('canvas');
		canvas.height = 60;
		canvas.width = width;
		return canvas;
	}

	async renderCanvas (data) {
		const that = this;
		const { audioContext } = this.props;
		let j = 0;
		let containerEl = this.containerEl || this.baseEl.querySelector(`.${styles.waveform}`);
		let timelineRoot = this.timelineRoot || this.baseEl.querySelector(`.${styles['waveform-timeline--root']}`);

		const canvas = this.createCanvas(containerEl.parentElement.clientWidth);
		const timeline = this.createCanvas(timelineRoot.parentElement.clientWidth);

		try {

			if (this.buffer == null) {
				const _get = await fetch(data.waveform_url);
				const bod = await _get.json();

				this.buffer = bod.concat([]);
			}

			const wave = new WaveformGenerator({
				canvas,
				bar_width: 2,
				bar_gap : 0.35,
				wave_color: linGrad,
				audioContext,
				onComplete () {
					const tline = new WaveformGenerator({ canvas: timeline, bar_width: 2, bar_gap : 0.35, wave_color: linGradProgress, audioContext });
					tline.extractBuffer(that.buffer);
				}
			});

			wave.extractBuffer(that.buffer);

			if (containerEl.firstChild == null) {
				containerEl.appendChild(canvas);
			} else {
				containerEl.replaceChild(canvas, containerEl.firstChild);
			}

			if (timelineRoot.firstChild == null) {
				timelineRoot.appendChild(timeline);
			} else {
				timelineRoot.replaceChild(timeline, timelineRoot.firstChild);
			}

			if (typeof window !== "undefined") {
	
				const state = Object.assign({}, store.getState());
	
				if (this.subscribed === false && state.currently_playing.playing === true && state.currently_playing.track.id === this.props.data.id) {
					this.subscribed = true;
					window.document.querySelector('audio').addEventListener('timeupdate', this.onTimeUpdate.bind(this));
				}
			}

		} catch (e) {
			// console.log(e);
		}
	}

	componentWillUnmount () {
		window.document.querySelector('audio').removeEventListener('timeupdate', this.onTimeUpdate.bind(this));
	}

	shouldComponentUpdate () {
		return false;
	}
	
	render ({ isCurrentTrack }) {
		return (
			<div class={styles.root} ref={e => (this.baseEl = e)}>
				<div class={`prel ${styles.container}`}>
					<div className={styles.waveform} ref={e => this.containerEl = e}></div>
					<div class={styles['waveform-timeline--root']} ref={e => this.timelineRoot = e}></div>
				</div>
			</div>
		);
	}
}

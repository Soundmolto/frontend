import { Component } from 'preact';
import { WaveformGenerator } from './WaveformGenerator';
import { seconds_to_time } from "../../utils/seconds-to-time";
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
	mouseDown = false;

	constructor (opts) {
		super(opts);
		let initialState = Object.assign({}, store.getState());
		if (typeof window !== "undefined") {
			window.addEventListener('resize', e => {
				this.loadData();
			});

			store.subscribe(_ => {
				window.requestAnimationFrame(_ => {
					const state = Object.assign({}, store.getState());
					const audioEl = window.document.querySelector('audio');

					if (state.UI.theme !== initialState.UI.theme) {
						initialState = state;
						this.loadData();
					}

					if (state.currently_playing.playing === true && state.currently_playing.track != null && state.currently_playing.track.id === this.props.data.id) {
						this.subscribed = true;
						
						if (audioEl != null) {
							audioEl.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
						}
					}
					
					if (this.subscribed && state.currently_playing && state.currently_playing.track != null && state.currently_playing.track.id !== this.props.data.id) {
						this.subscribed = false;
						if (audioEl != null) {
							audioEl.removeEventListener('timeupdate', this.onTimeUpdate.bind(this));
						}
					}
				});
			});
		}
	}

	onTimeUpdate (e) {
		if (this.props.data.id === store.getState().currently_playing.track.id) {
			const audio = window.document.querySelector('audio');
			if (this.timelineRoot == null && this.baseEl == null) return;
			const timelineRoot = this.timelineRoot || this.baseEl.querySelector(`.${styles['waveform-timeline--root']}`);
			timelineRoot.setAttribute('style', `width: ${audio.currentTime / audio.duration * 100}%;`);
		}
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

	onMouseMove (e) {
		const percentage = e.layerX / e.currentTarget.clientWidth;
		const tooltip = e.currentTarget.querySelector(`.${styles.tooltip}`);
		tooltip.classList.add(styles.show);
		tooltip.innerText = seconds_to_time(this.props.data.duration * percentage).rendered;

		if (this.mouseDown === true) {
			this.props.onClickContainer(this.props.data.duration * percentage);
		}

		if (tooltip.getAttribute('style') != null && parseInt(tooltip.getAttribute('style').split('transform: translateX(')[1].split('px)')) === e.layerX) {
			return;
		}

		if (e.currentTarget.clientWidth - e.layerX < tooltip.clientWidth) { return; }

		tooltip.setAttribute('style', `transform: translateX(${e.layerX}px)`);
	}

	onMouseOut (e) {
		if (e.relatedTarget && (e.relatedTarget.parentElement.parentElement == this.baseEl.firstChild || e.relatedTarget == this.baseEl.firstChild)) return;
		this.mouseDown = false;
		e.currentTarget.querySelector(`.${styles.tooltip}`).classList.remove(styles.show);
	}

	onMouseDown (e) {
		if (e.which !== 1) return;
		this.mouseDown = true;
		const percentage = e.layerX / e.currentTarget.clientWidth;
		this.props.onClickContainer(this.props.data.duration * percentage);
	}

	onMouseUp () {
		this.mouseDown = false;
	}

	componentWillUnmount () {
		this.subscribed = false;
		try {
			const audioEl = window.document.querySelector('audio');
			if (audioEl != null) {
				audioEl.removeEventListener('timeupdate', this.onTimeUpdate.bind(this));
			}
		} catch (e) {
			console.error(e);
		}
	}

	shouldComponentUpdate () {
		return false;
	}
	
	render () {
		return (
			<div class={styles.root} ref={e => (this.baseEl = e)}>
				<div class={`prel ${styles.container}`} onMouseMove={this.onMouseMove.bind(this)} onMouseOut={this.onMouseOut.bind(this)} onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)}>
					<div class={styles.tooltip}></div>
					<div className={styles.waveform} ref={e => this.containerEl = e}></div>
					<div class={styles['waveform-timeline--root']} ref={e => this.timelineRoot = e}></div>
				</div>
			</div>
		);
	}
}

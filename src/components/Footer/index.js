import { Component } from "preact";
import Goku from '../../assets/goku.png';
import styles from './style';
import Icon from 'preact-material-components/Icon';
import Button from 'preact-material-components/Button';
import Slider from 'preact-material-components/Slider';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Slider/style.css';
import { connect } from "preact-redux";
import { seconds_to_time } from "../../utils/seconds-to-time";
import { playing_now } from '../../actions/track';
import { QueuePanel } from "../QueuePanel";
import { MobileFooter } from "../MobileFooter";

@connect(({ currently_playing }) => ({ currently_playing }))
export default class Footer extends Component {
	
	pos = 0;
	duration = 0;
	__currentPos = 0;
	tracks = {};
	volume = 1;
	state = { shuffled: false, repeat: false };

	queuePanelRef = e => (this.queuePanel = e);
	volumePanelRef = e => (this.volumePanel = e);
	volumeSliderRef = e => (this.volumeSlider = e);

	constructor (opts) {
		super (opts);
		this.queue = this.props.queue;
		this.queue.on('set:tracks', tracks => this.updateQueue(tracks));
	}

	isCurrentlyPlayingNotEmpty (currently_playing) {
		return currently_playing.track != null;
	}

	get audioPlayerCurrentTime () {
		let audioPlayer = this.audioPlayer || { currentTime: 0 };
		return audioPlayer.currentTime;
	}

	updateQueue (queue) {
		console.log(queue);
		// Dispatch to server that queue has been updated, and the list of track ids.
	}

	toggleQueuePanel (e) {
		e.currentTarget.classList.toggle(styles.active);
		this.queuePanel.toggle();
		e.currentTarget.blur();
	}

	onPosChange () {
		const pos = this.audioPlayer.currentTime;
		const duration = this.audioPlayer.duration;
		this.__currentPos = pos;
		this.__currentTime = seconds_to_time(pos).rendered;
		this.progressBar.setAttribute('style', `transform: translateX(${pos / duration * 100}%)`);
		this.thumb.setAttribute('style', `transform: translateX(${pos / duration * this.thumb.parentElement.clientWidth}px)`);
		this.amount_el.textContent = this.__currentTime;
		this.tracks[this.props.currently_playing.track.id] = pos;
	}

	calculate_amount (currently_playing) {
		this.pos = currently_playing.position;
		this.duration = currently_playing.track.duration;
		return currently_playing.position / currently_playing.track.duration * 100;
	}

	onClickPlay () {
		const { currently_playing, dispatch } = this.props;
		if (this.isCurrentlyPlayingNotEmpty(currently_playing)) {
			playing_now(dispatch, {
				playing: true,
				position: currently_playing.position,
				track: currently_playing.track,
				owner: currently_playing.owner
			});
		}
	}

	onClickPause () {
		const { currently_playing, dispatch } = this.props;
		if (this.isCurrentlyPlayingNotEmpty(currently_playing)) {
			const audio = document.querySelector('audio') || { currentTime: this.__currentPos };
			playing_now(dispatch, {
				playing: false,
				position: audio.currentTime,
				track: currently_playing.track,
				owner: currently_playing.owner
			});
		}
	}

	onClickNext () {
		const { currently_playing, dispatch } = this.props;
		if (this.isCurrentlyPlayingNotEmpty(currently_playing)) {
			const next = this.queue.next();
			playing_now(dispatch, {
				playing: true,
				position: 0,
				track: next,
				owner: next.owner
			});
		}
	}

	onClickPrevious () {
		const { currently_playing, dispatch } = this.props;
		if (this.isCurrentlyPlayingNotEmpty(currently_playing)) {

			if (this.audioPlayerCurrentTime >= 3) {
				const { track } = currently_playing;
				playing_now(dispatch, {
					playing: true,
					position: 0,
					track: track,
					owner: track.owner
				});
			} else {
				const next = this.queue.previous();
				playing_now(dispatch, {
					playing: true,
					position: 0,
					track: next,
					owner: next.owner
				});
			}
		}
	}

	onClickTrackBar (e) {
		const { currently_playing, dispatch } = this.props;
		const percent = (e.pageX / e.currentTarget.clientWidth);
		const position = percent * this.duration;

		playing_now(dispatch, { playing: true, position, track: currently_playing.track, owner: currently_playing.owner });
	}

	componentDidMount () {
		let { audioPlayer } = this;

		if (this.props.currently_playing.track != null) {
			const { currently_playing, dispatch } = this.props;
			const position = 0;

			if (audioPlayer == null && window.document.querySelector('audio') != null) {
				audioPlayer = window.document.querySelector('audio');
			}

			audioPlayer.addEventListener('ended', e => {
				this.tracks[currently_playing.track.id] = 0;
				playing_now(dispatch, { playing: false, position, track: currently_playing.track, owner: currently_playing.owner });
				requestAnimationFrame(_ => {
					const track = this.queue.next();
					let owner = currently_playing.owner;
					if (track != null) {
						if (currently_playing.owner.id !== track.owner) {
							owner = null;
						}
						playing_now(dispatch, { playing: true, position, track, owner });
					} else {
						playing_now(dispatch, { playing: false, position, track: currently_playing.track, owner });
					}
				})
			});
		}
	}

	componentDidUpdate () {
		const { currently_playing } = this.props;
		let { audioPlayer } = this;
		if (audioPlayer == null && window.document.querySelector('audio') != null) {
			audioPlayer = window.document.querySelector('audio');
		}
		if (currently_playing.playing === true) {
			if (currently_playing.position != null && currently_playing.position < this.tracks[currently_playing.track.id]) {
				this.tracks[currently_playing.track.id] = currently_playing.position;
			}
			audioPlayer.addEventListener('timeupdate', this.onPosChange.bind(this));
			requestAnimationFrame(_ => {
				const updatedTime = this.tracks[currently_playing.track.id] || currently_playing.position || 0;

				if (audioPlayer.src !== currently_playing.track.stream_url) {
					audioPlayer.src = currently_playing.track.stream_url;
				}

				if (audioPlayer.currentTime !== updatedTime || audioPlayer.paused === true) {
					audioPlayer.play();
					audioPlayer.currentTime = updatedTime;
				}
			});
		} else {
			if (currently_playing.track) {
				this.tracks[currently_playing.track.id] = audioPlayer.currentTime;
				audioPlayer.pause();
			}
		}
	}

	componentWillUpdate (nextProps) {
		let { audioPlayer } = this;
		const currently_playing = nextProps.currently_playing || this.props.currently_playing;
		
		if (audioPlayer == null && window.document.querySelector('audio') != null) {
			audioPlayer = window.document.querySelector('audio');
		}

		if (currently_playing.track && audioPlayer.currentTime > this.tracks[currently_playing.track.id]) {
			this.tracks[currently_playing.track.id] = audioPlayer.currentTime;
		} else {
			if (currently_playing.track) {
				this.tracks[currently_playing.track.id] = currently_playing.position;
			}
		}

		if (currently_playing.position > audioPlayer.currentTime) {
			this.tracks[currently_playing.track.id] = currently_playing.position;
		}

		audioPlayer.removeEventListener('timeupdate', this.onPosChange.bind(this));
	}

	onMouseMove (e) {
		const { currently_playing, dispatch } = this.props;
		const duration = (currently_playing.track && currently_playing.track.duration) || 0;
		const percentage = (e.pageX - 150) / this.desktopTrackbar.clientWidth;
		const time = duration * percentage;
		const tooltip = this.desktopTrackbar.querySelector(`.${styles.tooltip}`);
		const rendered = seconds_to_time(Math.max(0, time)).rendered;
		this.__renderedTime = rendered;
		tooltip.classList.add(styles.show);
		tooltip.innerText = rendered;

		if (this.mouseDown === true) {
			playing_now(dispatch, { playing: true, position: time, track: currently_playing.track, owner: currently_playing.owner });
		}

		if (tooltip.getAttribute('style') != null && parseInt(tooltip.getAttribute('style').split('transform: translateX(')[1].split('px)')) === e.pageX) {
			return;
		}

		if ((this.desktopTrackbar.clientWidth - e.pageX) + 150 < tooltip.clientWidth) { return; }

		tooltip.setAttribute('style', `transform: translateX(${e.pageX - 150}px)`);
	}

	onMouseOut (e) {
		if (e.relatedTarget.parentElement == this.desktopTrackbar || e.relatedTarget.parentElement.parentElement == this.desktopFooter) return;
		this.mouseDown = false;
		e.currentTarget.querySelector(`.${styles.tooltip}`).classList.remove(styles.show);
	}

	onMouseDown (e) {
		if (e.which !== 1) return;
		this.mouseDown = true;
		const { currently_playing, dispatch } = this.props;
		const duration = (currently_playing.track && currently_playing.track.duration) || 0;
		const percentage = ( e.pageX - 150) / e.currentTarget.clientWidth;

		playing_now(dispatch, {
			playing: true,
			position: duration * percentage,
			track: currently_playing.track,
			owner: currently_playing.owner
		});
	}

	onMouseUp () {
		this.mouseDown = false;
	}

	shuffle () {
		const { dispatch, currently_playing } = this.props;
		if (!this.state.shuffled) {
			this.queue.shuffle();
		} else {
			this.queue.resetShuffle();
		}
		this.setState({ shuffled: !this.state.shuffled });

		playing_now(dispatch, {
			playing: true,
			position: this.audioPlayer.currentTime,
			track: currently_playing.track,
			owner: currently_playing.owner
		});
	}

	repeat () {
		const { dispatch, currently_playing } = this.props;
		const { track, owner } = currently_playing;
		const position = this.audioPlayer.currentTime;
		const playing = true;
		const willRepeat = !this.state.repeat;

		this.queue.repeat = willRepeat;
		this.setState({ repeat: willRepeat });
		playing_now(dispatch, { playing, position, track, owner });
	}

	getArtwork (track) {
		const userAvatar = track && track.user && track.user.profilePicture;
		const trackArtwork = track && track.artwork;
		return trackArtwork || userAvatar || Goku;
	}

	render ({ currently_playing, audioPlayer }) {
		let amount = 0;
		let duration = 0;
		let playing = currently_playing != null && currently_playing.playing;
		let parentWidth = 1;
		const owner = currently_playing.owner && currently_playing.track && currently_playing.track.user && (currently_playing.track.user.displayName || currently_playing.track.user.url);
		const trackName = (currently_playing && currently_playing.track && currently_playing.track.name || "");
		this.audioPlayer = audioPlayer;

		if (currently_playing != null && currently_playing.track != null) {
			amount = this.calculate_amount(currently_playing);
			duration = parseInt(currently_playing.track.duration);
		}

		if (this.thumb != null) {
			parentWidth = this.thumb.parentElement.clientWidth;
		}

		return (
			<div>
				<MobileFooter
					trackName={trackName}
					owner={owner}
					playing={playing}
					onClickPlay={this.onClickPlay.bind(this)}
					onClickPause={this.onClickPause.bind(this)}
					footerClass={styles.footer}
				/>
				<div class={styles.notMobile}>
					<QueuePanel ref={this.queuePanelRef} queue={this.queue} getArtwork={this.getArtwork} currently_playing={currently_playing} />
					<div class={styles.footer} ref={e => (this.desktopFooter = e)}>
						<div class={styles.start}>
							<div class={styles.artwork}>
								<div class={styles.blurred} style={{'background-image': `url(${this.getArtwork(currently_playing.track || {})})`}}></div>
								<div class={styles.overlay}>
									<img src={this.getArtwork(currently_playing.track || {})} />
								</div>
							</div>
							<div class={styles.trackBar} onClick={this.onClickTrackBar.bind(this)}
								onMouseMove={this.onMouseMove.bind(this)} onMouseOut={this.onMouseOut.bind(this)}
								onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)}
								ref={e => (this.desktopTrackbar = e)}
							>
								<div class={styles.tooltip}>{this.__renderedTime != null && this.__renderedTime}</div>
								<div class={styles.progress} style={{
									'transform': `translateX(${amount}%)`
								}} ref={e => (this.progressBar = e)}></div>
								<div class={styles.thumb} style={{
									'transform': `translateX(${this.__currentPos / this.duration* parentWidth}px)`
								}} ref={e => (this.thumb = e)}></div>
							</div>
							
							<div class={styles.songInfo}>
								<p>
									<span>{currently_playing.track && currently_playing.track.user && (
										<a href={`/${currently_playing.track.user.url}`} class={styles.artist}>
											{currently_playing.track.user.displayName || currently_playing.track.user.url || "N/A"}
										</a>
									)}</span>
									<span>{currently_playing && currently_playing.track && currently_playing.track.user && (
										<a href={`/${currently_playing.track.user.url}/${currently_playing.track.url}`}>
											{currently_playing.track.name}
										</a>
									)}</span>
								</p>
							</div>
						</div>
						<div class={styles.middle}>
							<p ref={e => (this.amount_el = e)}>
								{this.__currentTime == null && seconds_to_time(amount).rendered}
								{this.__currentTime != null && this.__currentTime}
							</p>
							<Button ripple className={`${styles.button}`} onClick={this.onClickPrevious.bind(this)}>
								<Icon style={{ margin: 0 }}>skip_previous</Icon>
							</Button>
							
							{!playing && (
								<Button ripple className={`${styles.button}`} onClick={this.onClickPlay.bind(this)}>
									<Icon style={{ margin: 0 }}>play_arrow</Icon>
								</Button>
							)}

							{playing && (
								<Button ripple className={`${styles.button}`} onClick={this.onClickPause.bind(this)}>
									<Icon style={{ margin: 0 }}>pause</Icon>
								</Button>
							)}
							<Button ripple className={`${styles.button}`} onClick={this.onClickNext.bind(this)}>
								<Icon style={{ margin: 0 }}>skip_next</Icon>
							</Button>
							<p>{seconds_to_time(duration).rendered}</p>
						</div>
						<div class={styles.end}>
							<div class={styles.volumePanel} ref={this.volumePanelRef}>
								<Slider step={2} value={this.volume * 100} max={100} discrete={true} ref={this.volumeSliderRef} onInput={e => {
									this.volume = this.volumeSlider.getValue() / 100;
									this.audioPlayer.volume = this.volume;
								}} />
							</div>
							<Button ripple className={`${styles.button}`} onClick={e => {
								e.currentTarget.classList.toggle(styles.active);
								this.volumePanel.classList.toggle(styles.show);
								e.currentTarget.blur();
							}}>
								<Icon style={{ margin: 0 }}>volume_up</Icon>
							</Button>
							<Button ripple className={`${styles.button}`} onClick={this.toggleQueuePanel.bind(this)}>
								<Icon style={{ margin: 0 }}>queue_music</Icon>
							</Button>
							<Button ripple className={`${styles.button} ${this.state.repeat === true && styles.active}`} onClick={this.repeat.bind(this)}>
								<Icon style={{ margin: 0 }}>repeat</Icon>
							</Button>
							<Button ripple className={`${styles.button} ${this.state.shuffled === true && styles.active}`} onClick={this.shuffle.bind(this)}>
								<Icon style={{ margin: 0 }}>shuffle</Icon>
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
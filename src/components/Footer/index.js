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

@connect(({ currently_playing }) => ({ currently_playing }))
export default class Footer extends Component {
	
	pos = 0;
	duration = 0;
	__currentPos = 0;
	tracks = {};
	volume = 1;

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

	updateQueue (queue) {
		console.log(queue);
		// Dispatch to server that queue has been updated, and the list of track ids.
	}

	toggleQueuePanel () {
		this.queuePanel.classList.toggle(styles.show);
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
			playing_now(dispatch, {
				playing: false,
				position: this.__currentPos,
				track: currently_playing.track,
				owner: currently_playing.owner
			});
		}
	}

	onClickTrackBar (e) {
		const { currently_playing, dispatch } = this.props;
		const percent = (e.pageX / e.currentTarget.clientWidth);
		const position = percent * this.duration;

		playing_now(dispatch, { playing: true, position, track: currently_playing.track, owner: currently_playing.owner });
	}

	componentDidMount () {
		if (this.props.currently_playing.track != null) {
			const { currently_playing, dispatch } = this.props;
			const position = 0;

			this.audioPlayer.addEventListener('ended', e => {
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
			if (currently_playing.position != null) {
				this.tracks[currently_playing.track.id] = currently_playing.position;
			}
			this.audioPlayer.addEventListener('timeupdate', this.onPosChange.bind(this));
			requestAnimationFrame(_ => {
				this.audioPlayer.play();
				this.audioPlayer.currentTime = this.tracks[currently_playing.track.id] || currently_playing.position || 0;
			});
		} else {
			this.tracks[currently_playing.track.id] = this.audioPlayer.currentTime;
			this.audioPlayer.pause();
		}
	}

	onMouseMove (e) {
		const { currently_playing, dispatch } = this.props;
		const duration = currently_playing.track.duration || 0;
		const percentage = e.pageX / this.desktopTrackbar.clientWidth;
		const time = duration * percentage;
		const tooltip = this.desktopTrackbar.querySelector(`.${styles.tooltip}`);
		const rendered = seconds_to_time(time).rendered;
		this.__renderedTime = rendered;
		tooltip.classList.add(styles.show);
		tooltip.innerText = rendered;

		if (this.mouseDown === true) {
			playing_now(dispatch, { playing: true, position: time, track: currently_playing.track, owner: currently_playing.owner });
		}

		if (tooltip.getAttribute('style') != null && parseInt(tooltip.getAttribute('style').split('transform: translateX(')[1].split('px)')) === e.pageX) {
			return;
		}

		if (this.desktopTrackbar.clientWidth - e.pageX < tooltip.clientWidth) { return; }

		tooltip.setAttribute('style', `transform: translateX(${e.pageX}px)`);
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
		const duration = currently_playing.track.duration || 0;
		const percentage = e.pageX / e.currentTarget.clientWidth;

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

	getArtwork () {
		const currently_playing = this.props.currently_playing || {};
		const userAvatar = currently_playing.track && currently_playing.track.user && currently_playing.track.user.profilePicture;
		const trackArtwork = currently_playing.track && currently_playing.track.artwork;
		return trackArtwork || userAvatar || Goku;
	}

	render ({ currently_playing }) {
		let amount = 0;
		let duration = 0;
		let playing = currently_playing != null && currently_playing.playing;
		let parentWidth = 1;

		if (currently_playing != null && currently_playing.track != null) {
			amount = this.calculate_amount(currently_playing);
			duration = parseInt(currently_playing.track.duration);
		}

		if (this.thumb != null) {
			parentWidth = this.thumb.parentElement.clientWidth;
		}

		return (
			<div>
				<div class={styles.mobile}>
					<div class={styles.footer}>
						<div class={styles.start}>
							<div class={styles.songInfo}>
								<p>
									<span>{currently_playing.owner && currently_playing.track.user && (currently_playing.track.user.displayName || currently_playing.track.user.url)}</span>
									<span>{currently_playing && currently_playing.track && currently_playing.track.name}</span>
								</p>
							</div>
						</div>
						<div class={styles.end}>
						{!playing && (
							<Button ripple className={`${styles.button}`} onClick={this.onClickPlay.bind(this)}>
								<Icon style={{ margin: 0 }} >play_arrow</Icon>
							</Button>
						)}

						{playing && (
							<Button ripple className={`${styles.button}`} onClick={this.onClickPause.bind(this)}>
								<Icon style={{ margin: 0 }} >pause</Icon>
							</Button>
						)}
						</div>
					</div>
				</div>
				<div class={styles.notMobile}>
					<div class={styles.queuePanel} ref={this.queuePanelRef}>
							<ul>
							{this.queue.tracks.length >= 1 && this.queue.tracks.map(track => (
								<li>
									<div class={styles.flex}>
										<a title={track.name} href={`/${track.user.url}/${track.url}`}>
											{track.name}
										</a>
										-
										<a href={`/${track.user.url}`}>
											{track.user && (track.user.displayName || track.user.url || "N/A")}
										</a>
									</div>
								</li>
							))}
							{this.queue.tracks.length <= 0 && (
								<li>
									<div class={styles.flex}>
										<div>
											Nothing present in the queue yet!
										</div>
									</div>
								</li>
							)}
						</ul>
					</div>
					<div class={styles.footer} ref={e => (this.desktopFooter = e)}>
						<div class={styles.start}>
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
							<div class={styles.artwork}><img src={this.getArtwork()} /></div>
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
							<Button ripple className={`${styles.button}`}>
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
							<Button ripple className={`${styles.button}`}>
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
								this.volumePanel.classList.toggle(styles.show);
							}}>
								<Icon style={{ margin: 0 }}>volume_up</Icon>
							</Button>
							<Button ripple className={`${styles.button}`} onClick={this.toggleQueuePanel.bind(this)}>
								<Icon style={{ margin: 0 }}>queue_music</Icon>
							</Button>
							<Button ripple className={`${styles.button}`} onClick={e => console.log(e)}>
								<Icon style={{ margin: 0 }}>shuffle</Icon>
							</Button>
						</div>
					</div>
				</div>
				{currently_playing != null && currently_playing.track != null && (
					<audio src={currently_playing.track.stream_url} ref={e => (this.audioPlayer = e)} volume={this.volume} />
				)}
			</div>
		);
	}
}
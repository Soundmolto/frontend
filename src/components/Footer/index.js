import { Component } from "preact";
import Goku from '../../assets/goku.png';
import styles from './style';
import Icon from 'preact-material-components/Icon';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import { connect } from "preact-redux";
import { seconds_to_time } from "../../utils/seconds-to-time";
import { playing_now } from '../../actions/track';
import { ENOLCK } from "constants";
import { QueueController } from "../QueueController/QueueController";

@connect(({ currently_playing }) => ({ currently_playing }))
export default class Footer extends Component {
	
	pos = 0;
	duration = 0;
	__currentPos = 0;
	tracks = {};

	constructor (opts) {
		super (opts);

		this.queueController = new QueueController();
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
		playing_now(dispatch, {
			playing: true,
			position: currently_playing.position,
			track: currently_playing.track,
			owner: currently_playing.owner
		});
	}

	onClickPause () {
		const { currently_playing, dispatch } = this.props;
		playing_now(dispatch, {
			playing: false,
			position: this.__currentPos,
			track: currently_playing.track,
			owner: currently_playing.owner
		})
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
			});
		}
	}

	componentWillUpdate ({ currently_playing }) {
		if (currently_playing.playing === true) {
			if (currently_playing.position != null) {
				this.tracks[this.props.currently_playing.track.id] = currently_playing.position;
			}
			this.audioPlayer.addEventListener('timeupdate', this.onPosChange.bind(this));
			requestAnimationFrame(_ => {
				this.audioPlayer.play();
				this.audioPlayer.currentTime = this.tracks[this.props.currently_playing.track.id] || currently_playing.position || 0;
			});
		} else {
			this.tracks[this.props.currently_playing.track.id] = this.audioPlayer.currentTime;
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
									<span>{currently_playing.owner && currently_playing.owner.profile && (currently_playing.owner.profile.displayName || currently_playing.owner.profile.url)}</span>
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
							<div class={styles.artwork}><img src={Goku} /></div>
							<div class={styles.songInfo}>
								<p>
									<span>{currently_playing.owner && currently_playing.owner.profile && (
										<a href={`/${currently_playing.owner.profile.url}`} class={styles.artist}>
											{currently_playing.owner.profile.displayName}
										</a>
									)}</span>
									<span>{currently_playing && currently_playing.track && (
										<a href={`/${currently_playing.owner.profile.url}/${currently_playing.track.url}`}>
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
										<Icon style={{ margin: 0 }} >play_arrow</Icon>
								</Button>
							)}

							{playing && (
								<Button ripple className={`${styles.button}`} onClick={this.onClickPause.bind(this)}>
										<Icon style={{ margin: 0 }} >pause</Icon>
								</Button>
							)}
							<Button ripple className={`${styles.button}`}>
								<Icon style={{ margin: 0 }}>skip_next</Icon>
							</Button>
							<p>{seconds_to_time(duration).rendered}</p>
						</div>
						<div class={styles.end}>
							[Placeholder for extra controls]
						</div>
					</div>
				</div>
				{currently_playing != null && currently_playing.track != null && (
					<audio src={currently_playing.track.stream_url} ref={e => (this.audioPlayer = e)} />
				)}
			</div>
		);
	}
}
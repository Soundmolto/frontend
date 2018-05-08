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

@connect(({ currently_playing }) => ({ currently_playing }))
export default class Footer extends Component {
	
	pos = 0;
	duration = 0;
	__currentPos = 0;

	onPosChange (pos) {
		this.__currentPos = pos;
		this.__currentTime = seconds_to_time(pos).rendered;
		this.progressBar.setAttribute('style', `transform: translateX(${pos / this.duration * 100}%)`);
		this.amount_el.textContent = this.__currentTime;
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
		const percent = (e.offsetX / e.currentTarget.clientWidth);
		const position = percent * this.duration;

		playing_now(dispatch, { playing: true, position, track: currently_playing.track, owner: currently_playing.owner });
	}

	render ({ currently_playing }) {
		let amount = 0;
		let duration = 0;
		let playing = currently_playing != null && currently_playing.playing;
		if (currently_playing != null && currently_playing.track != null) {
			amount = this.calculate_amount(currently_playing);
			duration = parseInt(currently_playing.track.duration);
		}

		return (
			<div>
				<div class={styles.mobile}>
					<div class={styles.footer}>
						<div class={styles.start}>
							<div class={styles.songInfo}>
								<p>
									<span>{currently_playing.owner && currently_playing.owner.profile && currently_playing.owner.profile.displayName}</span>
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
					<div class={styles.footer}>
						<div class={styles.start}>
							<div class={styles.trackBar} onClick={this.onClickTrackBar.bind(this)}>
								<div class={styles.progress} style={{
									'transform': `translateX(${amount}%)`
								}} ref={e => (this.progressBar = e)}></div>
							</div>
							<div class={styles.artwork}><img src={Goku} /></div>
							<div class={styles.songInfo}>
								<p>
									<span>{currently_playing.owner && currently_playing.owner.profile && currently_playing.owner.profile.displayName}</span>
									<span>{currently_playing && currently_playing.track && currently_playing.track.name}</span>
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
			</div>
		);
	}
}
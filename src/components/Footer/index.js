import { Component } from "preact";
import Goku from '../../assets/goku.png';
import styles from './style';
import Icon from 'preact-material-components/Icon';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import { connect } from "preact-redux";
import { seconds_to_time } from "../../utils/seconds-to-time";

@connect(({ currently_playing }) => ({ currently_playing }))
export default class Footer extends Component {
	
	pos = 0;
	duration = 0;

	onPosChange (pos) {
		this.__currentTime = seconds_to_time(pos).rendered;
		this.progressBar.setAttribute('style', `transform: translateX(${pos / this.duration * 100}%)`);
		this.amount_el.textContent = this.__currentTime;
	}

	calculate_amount (currently_playing) {
		this.pos = currently_playing.position;
		this.duration = currently_playing.track.duration;
		return currently_playing.position / currently_playing.track.duration * 100;
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
			<div class={styles.footer}>
				<div class={styles.start}>
					<div class={styles.trackBar}>
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
					<Button ripple className={`${styles.button}`}>
						{!playing && <Icon style={{ margin: 0 }}>play_arrow</Icon>}
						{playing && <Icon style={{ margin: 0 }}>pause</Icon>}
					</Button>
					<Button ripple className={`${styles.button}`}>
						<Icon style={{ margin: 0 }}>skip_next</Icon>
					</Button>
					<p>{seconds_to_time(duration).rendered}</p>
				</div>
				<div class={styles.end}>
				dssdjh
				</div>
			</div>
		);
	}
}
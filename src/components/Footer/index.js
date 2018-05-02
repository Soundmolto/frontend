import { Component } from "preact";
import Goku from '../../assets/goku.png';
import styles from './style';
import { connect } from "preact-redux";

@connect(({ currently_playing }) => ({ currently_playing }))
export default class Footer extends Component {
	
	pos = 0;
	duration = 0;

	onPosChange (pos) {
		this.progressBar.setAttribute('style', `transform: translateX(${pos / this.duration * 100}%)`);
	}	

	render ({ currently_playing }) {
		let amount = 0;
		if (currently_playing != null && currently_playing.track != null) {
			this.pos = currently_playing.position;
			this.duration = currently_playing.track.duration;
			amount = currently_playing.position / currently_playing.track.duration * 100;
		}

		console.log(currently_playing);

		return (
			<div class={styles.footer}>
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
		);
	}
}
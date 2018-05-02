import { Component } from "preact";
import Goku from '../../assets/goku.png';
import styles from './style';

export default class Footer extends Component {
	render () {
		return (
			<div class={styles.footer}>
				<div class={styles.trackBar}><div class={styles.progress}></div></div>
				<div class={styles.artwork}><img src={Goku} /></div>
				<div class={styles.songInfo}>
					<p>
						<span>Jake</span>
						<span>Moe shop - Superstar</span>
					</p>
				</div>
			</div>
		);
	}
}
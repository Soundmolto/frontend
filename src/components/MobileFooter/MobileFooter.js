import { Component } from "preact";
import Icon from 'preact-material-components/Icon';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import styles from './style';

export class MobileFooter extends Component {
	render ({ trackName, owner, playing, onClickPlay, onClickPause }) {
		return (
			<div class={styles.mobile}>
				<div class={styles.footer}>
					<div class={styles.start}>
						<div class={styles.songInfo}>
							<p>
								<span>{owner}</span>
								<span>{trackName}</span>
							</p>
						</div>
					</div>
					<div class={styles.end}>
						{!playing && (
							<Button ripple className={`${styles.button}`} onClick={onClickPlay}>
								<Icon style={{ margin: 0 }} >play_arrow</Icon>
							</Button>
						)}

						{playing && (
							<Button ripple className={`${styles.button}`} onClick={onClickPause}>
								<Icon style={{ margin: 0 }} >pause</Icon>
							</Button>
						)}
					</div>
				</div>
			</div>
		);
	}
}
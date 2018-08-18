import { Component } from "preact";
import Icon from 'preact-material-components/Icon';
import styles from './style';
import { seconds_to_time } from "../../utils/seconds-to-time";

export class QueuePanel extends Component {

	toggle () {
		this.queuePanel.classList.toggle(styles.show);
	}

	render ({ queue, getArtwork, currently_playing }) {
		return (
			<div class={styles.queuePanel} ref={e => (this.queuePanel = e)}>
				{queue.tracks.length >= 1 && (
					<div>
						<div class={styles.mainHeader}>
							<div class={styles.images}>
								{queue.tracks.slice(0, 4).map(track => (<img src={getArtwork(track)} />))}
							</div>
							<div class={styles.overlay}>
								<p>Playing from:</p>
								<p class={styles.bold}>{queue.title}</p>
							</div>
						</div>
						<div class={`${styles.flex} ${styles.header}`} style={{ 'justify-content': 'space-between' }}>
							<div style={{ width: '100%', maxWidth: 'calc(100% - 200px)', marginLeft: '37px' }}>
								<p>Song</p>
							</div>
							<div style={{ width: 'auto', 'flex-direction': 'row', float: 'right' }}>
								<span style={{ width: '35px' }}>
									<Icon>access_time</Icon>
								</span>
								<span style={{ width: '35px' }}>
									<Icon>favorite</Icon>
								</span>
								<span style={{ width: '35px' }}>
									<Icon>headset</Icon>
								</span>
							</div>
						</div>
					</div>
				)}
				<ul>
					{queue.tracks.length >= 1 && queue.tracks.map(track => (
						<li class={`${currently_playing.track && track.id === currently_playing.track.id ? styles.active : ''}`}>
							<div class={styles.flex} style={{ 'justify-content': 'space-between' }}>
								<img src={getArtwork(track)} />
								<div style={{ width: '100%' }}>
									<a title={track.name} href={`/${track.user.url}/${track.url}`}>
										{track.name}
									</a>
									<a href={`/${track.user.url}`} style={{ 'font-weight': '500', 'font-size': '0.75rem' }}>
										{track.user && (track.user.displayName || track.user.url || "N/A")}
									</a>
								</div>
								<div style={{ width: 'auto', 'flex-direction': 'row' }}>
									<span style={{ width: '100px' }}>
										{seconds_to_time(track.duration).rendered || '00:00'}
									</span>
									<span>
										{track.amountOfLikes || 0}
									</span>
									<span>
										{track.plays || 0}
									</span>
								</div>
							</div>
						</li>
					))}
					{queue.tracks.length <= 0 && (
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
		);
	}
}
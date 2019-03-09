import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import List from 'preact-material-components/List';
import Icon from 'preact-material-components/Icon';
import Button from 'preact-material-components/Button';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Button/style.css';
import Helmet from 'preact-helmet';
import styles from './style.css'
import { get_playlist } from '../../actions/playlist';
import { TrackListItem } from '../../components/TrackListItem';
import Goku from '../../assets/goku.png';
import { playing_now } from '../../actions/track';
import { seconds_to_time } from '../../utils/seconds-to-time';

@connect(({ playlist }) => ({ playlist }))
export default class Playlist extends Component {

	componentDidMount () {
		this.updateData();
	}

	updateData () {
		const { dispatch, playlistID } = this.props;
		get_playlist(dispatch, { playlistID });
	}

	onStartPlay = (track) => {
		const { queue, playlist } = this.props;
		const { tracks, name } = playlist.playlist;
		let i = 0;

		for (const index in tracks) {
			if (tracks[index].id === track.id) {
				i = parseInt(index);
			}
		}

		queue.title = name;
		queue.tracks = [].concat(tracks);
		queue.position = i || 0;
	}

	playAll = () => {
		const { dispatch, queue, playlist } = this.props;
		const { tracks, name } = playlist.playlist;
		const track = tracks[0];
		playing_now(dispatch, { playing: true, track, owner: track.user, position: 0 });

		queue.title = name;
		queue.tracks = [].concat(tracks);
		queue.position = 0;
	}

	onRemoveItem () {}

	getArtwork (track) {
		const userAvatar = track && track.user && track.user.profilePicture;
		const trackArtwork = track && track.artwork;
		return trackArtwork || userAvatar || Goku;
	}

	render ({ playlist, playlistID }) {
		const playlistData = playlist.playlist || { tracks: [], name: '', description: '', id: '' };
		const { tracks, name, description, id, owner = {} } = playlistData;
		const profile = owner.profile || { displayName: '', url: '', firstName: '', id: '' };
		let images = tracks.map(track => this.getArtwork(track));
		let totalLength = 0;
		for (const track of tracks) {
			totalLength += track.duration;
		}
		if (playlistID !== id) {
			this.updateData();
		}

		return (
			<div>
				<Helmet
					title={`SoundMolto - ${name || 'Untitled Playlist'}`}
				/>
				<div class={`header ${styles.header}`}>
					<div class={styles.overlay}>
						<div>
							<h1>
								{name || 'Untitled Playlist'} <br />
								<small>{description}</small>
							</h1>

							<p>
								By: <a href={`/${profile.url}`}>{profile.displayName || profile.firstName || profile.id}</a>
							</p>
							<p>
								{tracks.length} tracks &middot; {seconds_to_time(totalLength).rendered}
							</p>

							<Button ripple={true} class={styles.button} onClick={this.playAll}>
								<Icon class={styles.playButton}>play_arrow</Icon>
								Play All
							</Button>
						</div>
					</div>

					<div class={styles.images}>
						{images.slice(0, 7).map(image => (<img src={image} />))}
					</div>
				</div>
				<div class={styles.rootContainer}>
					<List class={styles.list}>
						{tracks.length >= 1 && tracks.map(track => 
							<TrackListItem
								onClick={this.onStartPlay}
								track={track}
								user={track.user}
								onRemoveItem={this.onRemoveItem.bind(this)}
								showArtwork={true}
								showExtraStats={false}
								showAdded={true}
							/>
						)}
						{tracks.length === 0 && (
							<h1>This playlist has no tracks yet!</h1>
						)}
					</List>
				</div>
			</div>
		);
	}
}

import { h, Component } from 'preact';
import 'preact-material-components/LayoutGrid/style.css';
import 'preact-material-components/Button/style.css';
import { connect } from 'preact-redux';
import { get_track } from '../../actions/track';
import style from './style';
import { getCurrentUrl, route } from 'preact-router';
import { TrackCard } from '../../components/TrackCard';

@connect(state => state)
export default class Profile extends Component {

	tracks = [];

	currentUrl = getCurrentUrl();

	componentDidMount () {
		this.updateData();
	}

	updateData () {
		const { auth, dispatch, track_url, vanity_url } = this.props;
		get_track(this.props.dispatch.bind(this), {
			token: auth.token,
			track_url,
			vanity_url
		});
		this.currentUrl = getCurrentUrl();
	}

	/**
	 * When the user starts playing a track.
	 * 
	 * @param {Object} track - Currently playing track
	 */
	onStartPlay (track) {
		const { queue } = this.props;
		const tracks = [].concat(this.tracks);
		let i = 0;
		for (const index in tracks) {
			if (tracks[index].id === track.id) {
				i = index;
			}
		}
		if (i !== 0) {
			tracks.splice(0, i);
		}
		queue.tracks = [].concat(tracks);

		console.log(queue.tracks);
	}

	render({ user, viewedUser, track }) {
		const viewedTrack = track.track;
		const trackOwner = track.user;
		const tracks = viewedUser.tracks.sort((first, second) => parseInt(second.createdAt) - parseInt(first.createdAt));
		this.tracks = [track.track].concat(tracks);

		console.log(this.tracks);

		return (
			<div class={style.profile}>
				<div class={"header " + style.header}>
					<h1>
					{viewedTrack != null && viewedTrack.id != null && viewedTrack.owner != null && (
						viewedTrack.name
					)}
					</h1>
				</div>
				<div class={style.profile_contents}>
					{viewedTrack != null && viewedTrack.id != null && viewedTrack.owner != null && (
						<TrackCard track={viewedTrack} user={trackOwner} currentUser={user} key={viewedTrack.id} audioContext={this.props.audioContext} isCurrentTrack={true}
							onStartPlay={this.onStartPlay.bind(this)} />
					)}
					{(viewedTrack == null || viewedTrack != null && viewedTrack.id == null && viewedTrack.owner == null) && (
						<div>Oopsie doopsie me no findy the tracky wacky!!!</div>
					)}
				</div>
			</div>
		);
	}
}

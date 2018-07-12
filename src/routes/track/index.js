import { h, Component } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import 'preact-material-components/Button/style.css';
import { connect } from 'preact-redux';
import { get_track } from '../../actions/track';
import style from './style';
import { getCurrentUrl } from 'preact-router';
import { TrackCard } from '../../components/TrackCard';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';

@connect(state => state)
export default class Track extends Component {

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
	}

	render({ user, viewedUser, track }) {
		const viewedTrack = track.track;
		const trackOwner = track.user;
		for (const track of viewedUser.tracks) {
			track.user = viewedUser.profile;
		}
		const tracks = viewedUser.tracks.sort((first, second) => parseInt(second.createdAt) - parseInt(first.createdAt));
		this.tracks = [track.track].concat(tracks);

		return (
			<div class={style.profile}>
				<Helmet title={`${APP.NAME} - ${(viewedTrack && viewedTrack.name) || "Loading..."}`} />
				<div class={"header " + style.header}>
					<h1>
						{viewedTrack != null && viewedTrack.id != null && viewedTrack.owner != null && (
							viewedTrack.name
						)}
					</h1>
				</div>
				<LayoutGrid>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell desktopCols="12" tabletCols="12" tabletOrder="1">
							<div class={style.profile_contents}>
								{viewedTrack != null && viewedTrack.id != null && viewedTrack.owner != null && (
									<TrackCard track={viewedTrack} user={trackOwner} currentUser={user} key={viewedTrack.id} audioContext={this.props.audioContext} isCurrentTrack={true}
										onStartPlay={this.onStartPlay.bind(this)} />
								)}
								{(viewedTrack == null || viewedTrack != null && viewedTrack.id == null && viewedTrack.owner == null) && (
									<div>Oopsie doopsie me no findy the tracky wacky!!!</div>
								)}
							</div>
						</LayoutGrid.Cell>
					</LayoutGrid.Inner>
				</LayoutGrid>
			</div>
		);
	}
}

import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import 'preact-material-components/Button/style.css';
import { connect } from 'preact-redux';
import { get_track } from '../../actions/track';
import style from './style';
import { UserDescription } from '../../components/UserDescription';
import { UserPictureName } from '../../components/UserPictureName';
import { UserFollowers } from '../../components/UserFollowers';
import { getCurrentUrl, route } from 'preact-router';
import { UserFollowing } from '../../components/UserFollowing';
import { TrackCard } from '../../components/TrackCard';

@connect(state => state)
export default class Profile extends Component {

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

	render({ auth, user, viewedUser, track }) {
		const viewedTrack = track.track;
		const trackOwner = track.user;
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
						<TrackCard track={viewedTrack} user={trackOwner} currentUser={user} key={viewedTrack.id} footer={this.props.footer} audioContext={this.props.audioContext} isCurrentTrack={true} />
					)}
					{(viewedTrack == null || viewedTrack != null && viewedTrack.id == null && viewedTrack.owner == null) && (
						<div>Oopsie doopsie me no findy the tracky wacky!!!</div>
					)}
				</div>
			</div>
		);
	}
}

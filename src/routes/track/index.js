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
		console.log(track);
		return (
			<div class={style.profile}>
				<div class={"header " + style.header}>
					<h1>
					{track.id != null && track.owner != null && (
						track.name
					)}
					</h1>
				</div>
				<div class={style.profile_contents}>
					{track.id != null && track.owner != null && (
						<TrackCard track={track} user={viewedUser} currentUser={user} key={track.id} footer={this.props.footer} audioContext={this.props.audioContext} isCurrentTrack={true} />
					)}
					{track.id == null && track.owner == null && (
						<div>Oopsie doopsie me no findy the tracky wacky!!!</div>
					)}
				</div>
			</div>
		);
	}
}

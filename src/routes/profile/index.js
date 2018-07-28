import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import 'preact-material-components/Button/style.css';
import { connect } from 'preact-redux';
import { fetch_user, follow_user, unfollow_user } from '../../actions/user';
import style from './style';
import { UserDescription } from '../../components/UserDescription';
import { UserPictureName } from '../../components/UserPictureName';
import { UserFollowers } from '../../components/UserFollowers';
import { getCurrentUrl } from 'preact-router';
import { UserFollowing } from '../../components/UserFollowing';
import { TrackCard } from '../../components/TrackCard';
import { USER } from '../../enums/user';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';

let _following = false;

@connect(state => state)
export default class Profile extends Component {

	currentUrl = getCurrentUrl();

	componentDidMount () {
		this.updateData();
	}

	updateData () {
		const { auth, vanity_url } = this.props;
		fetch_user(this.props.dispatch.bind(this), { token: auth.token, vanity_url });
		this.currentUrl = getCurrentUrl();
	}

	/**
	 * Check whether you are currently following this user.
	 * 
	 * @param {Object} user - You / The currently logged in user.
	 */
	following (user) {
		let r = false;
		if (user.followers.length >= 1) {
			for (const follower of user.followers) {
				if (follower.id === this.props.user.profile.id) {
					r = true;
				}
			}
		}

		// Memoize so we don't do this for functions
		_following = r;
		return r;
	}

	/**
	 * Toggle the following status.
	 */
	toggle_following () {
		const { auth, viewedUser } = this.props;
		if (_following) {
			unfollow_user(this.props.dispatch.bind(this), { token: auth.token, user: viewedUser });
		} else {
			follow_user(this.props.dispatch.bind(this), { token: auth.token, user: viewedUser });
		}
	}

	/**
	 * When the user starts playing a track.
	 * 
	 * @param {Object} track - Currently playing track
	 */
	onStartPlay (track) {
		const { queue, viewedUser } = this.props;
		const name = viewedUser.profile.displayName || viewedUser.profile.url;
		const tracks = [].concat(this.tracks);
		let i = 0;

		for (const index in tracks) {
			if (tracks[index].id === track.id) {
				i = index;
			}
		}

		queue.title = `${name}'s profile`;
		queue.tracks = [].concat(tracks);
		queue.position = i;
	}

	massageObject (object) {
		delete object.found;
		delete object.error;
		return Object.assign({}, object);
	}

	componentWillUpdate () {
		const state = this.props.store.getState();
		const viewed = this.massageObject(state.viewedUser);
		const user = this.massageObject(state.user);
		const are_same = JSON.stringify(viewed) === JSON.stringify(user);
		if (state.user.profile.url === this.props.vanity_url && false === are_same) {
			this.props.dispatch({
				type: USER.VIEW_PROFILE,
				payload: state.user
			});
		}
	}

	render({ auth, user, viewedUser }) {
		const following = this.following(viewedUser);
		if (this.currentUrl !== getCurrentUrl()) this.updateData();
		const tracks = viewedUser.tracks.sort((first, second) => parseInt(second.createdAt) - parseInt(first.createdAt));
		this.tracks = tracks.concat([]);

		return (
			<div class={style.profile}>
				<Helmet title={`${APP.NAME} - ${viewedUser.profile.displayName || viewedUser.profile.url}`} />
				<div class={"header " + style.header}>
					<UserPictureName user={viewedUser.profile} show_location={true} style={{
							width: '100%',
							position: 'relative',
							'overflow': 'hidden',
						}} h1_class={style.username_custom}>
						{auth.logged_in != null && user.profile.id !== viewedUser.profile.id && 
							<Button class={style.button} onClick={this.toggle_following.bind(this)}>
								{following && "Unfollow user"}
								{!following && "Follow user"}
							</Button>
						}
					</UserPictureName>
				</div>
				<div class={style.profile_contents}>
					<LayoutGrid>
						<LayoutGrid.Inner>
						<LayoutGrid.Cell desktopCols="9" tabletCols="12" tabletOrder="2">
								<h1 class={style.mainHeader} style={{ 'margin-top': "0" }}>
									Tracks <small class={style.smolButNotSwol}>{viewedUser.tracks.length}</small>
								</h1>
								{tracks.length >= 1 && tracks.map(track => (
									<div key={'parent-' + track.id}>
										<TrackCard track={track} user={viewedUser} currentUser={user}
											key={track.id} audioContext={this.props.audioContext}
											isCurrentTrack={false} onStartPlay={this.onStartPlay.bind(this)} />
									</div>
								))}
								{tracks.length <= 0 && <h1>No tracks</h1>}
							</LayoutGrid.Cell>
							<LayoutGrid.Cell desktopCols="3" tabletCols="12">
								<h1 class={style.mainHeader} style={{ 'margin-top': "0" }}>
									About
								</h1>
								{viewedUser != null && <UserDescription user={viewedUser.profile} />}
								{viewedUser != null && <UserFollowers viewedUser={viewedUser} style={{ 'margin-top': '20px' }} />}
								{viewedUser != null && <UserFollowing viewedUser={viewedUser} style={{ 'margin-top': '20px' }} />}
							</LayoutGrid.Cell>
						</LayoutGrid.Inner>
					</LayoutGrid>
				</div>
			</div>
		);
	}
}

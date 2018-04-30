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

let _following = false;

@connect(state => state)
export default class Profile extends Component {

	currentUrl = getCurrentUrl();

	constructor (opts) {
		super(opts);
	}

	componentDidMount () {
		this.updateData();
	}

	updateData () {
		const { auth, dispatch, vanity_url } = this.props;
		fetch_user(this.props.dispatch.bind(this), { token: auth.token, vanity_url });
		this.currentUrl = getCurrentUrl();
	}

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

	toggle_following () {
		const { auth, dispatch, viewedUser } = this.props;
		if (_following) {
			unfollow_user(this.props.dispatch.bind(this), { token: auth.token, user: viewedUser });
		} else {
			follow_user(this.props.dispatch.bind(this), { token: auth.token, user: viewedUser });
		}
	}

	render({ auth, user, viewedUser }) {
		const following = this.following(viewedUser);
		if (this.currentUrl !== getCurrentUrl()) this.updateData();

		return (
			<div class={style.profile}>
				<div class={"header " + style.header}>
					<UserPictureName user={viewedUser.profile} show_location={true} style={{ width: '100%', position: 'relative' }}>
						{auth.logged_in != null && user.profile.id !== viewedUser.profile.id && 
							<Button style={{ position: 'absolute', right: '28px', background: 'rgba(0, 0, 0, 0.2)', color: '#ffffff' }} onClick={this.toggle_following.bind(this)}>
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
								<h1 style={{ 'margin-top': "0" }}>
									Tracks <small class={style.smolButNotSwol}>{viewedUser.tracks.length}</small>
								</h1>
								{viewedUser.tracks.length >= 1 && viewedUser.tracks.map( track => <div>
									<TrackCard track={track} user={viewedUser} currentUser={user} key={track.id} />
								</div>)}
								{viewedUser.tracks.length <= 0 && <h1>No tracks</h1>}
							</LayoutGrid.Cell>
							<LayoutGrid.Cell desktopCols="3" tabletCols="12">
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

import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import 'preact-material-components/Button/style.css';
import { connect } from 'preact-redux';
import { fetch_user } from '../../actions/user';
import style from './style';
import { UserDescription } from '../../components/UserDescription';
import { UserPictureName } from '../../components/UserPictureName';
import { UserFollowers } from '../../components/UserFollowers';
import { UserFollowing } from '../../components/UserFollowing';
import { Waveform } from '../../components/Waveform';
import { TrackCard } from '../../components/TrackCard';
import { route } from 'preact-router';

@connect(state => state)
export default class MyProfile extends Component {

	componentDidMount () {
		const { auth, dispatch, vanity_url, user, path } = this.props;
		fetch_user(this.props.dispatch.bind(this), { token: auth.token, vanity_url: user.profile.url });
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ auth, user }) {
		if (!auth.logged_in) return route("/", true);
		const tracks = user.tracks.concat([]);
		tracks.reverse();
		return (
			<div class={style.profile} key={"user-profile-" + user.id}>
				<div class={"header " + style.header}>
					<UserPictureName user={user.profile} show_location={true} style={{
							width: '100%',
							position: 'relative',
							'max-width': '100%',
							'overflow': 'hidden',
						}} h1_class={style.username_custom} />
				</div>
				<div class={style.profile_contents} key={'profile-contents-' + user.id}>
					<LayoutGrid key={'layout-grid-' + user.id}>
						<LayoutGrid.Inner key={'layout-grid-inner-' + user.id}>
							<LayoutGrid.Cell desktopCols="9" tabletCols="12" tabletOrder="2" key={'layout-grid-cell-tracks-' + user.id}>
								<h1 class={style.mainHeader} style={{ 'margin-top': "0" }}>
									Tracks <small class={style.smolButNotSwol}>{tracks.length}</small>
								</h1>
								<div key={'user-tracks-' + user.id}>
									{tracks.length >= 1 && tracks.map(track => (
										<TrackCard track={track} user={user} currentUser={user} key={track.id} footer={this.props.footer} audioContext={this.props.audioContext} isCurrentTrack={false} />
									))}
									{tracks.length <= 0 && <h1>No tracks</h1>}
								</div>
							</LayoutGrid.Cell>
							<LayoutGrid.Cell desktopCols="3" tabletCols="12" tabletOrder="1" key={'layout-grid-cell-about-' + user.id}>
								<h1 class={style.mainHeader} style={{ 'margin-top': "0" }}>
									About
								</h1>
								{user != null && <UserDescription user={user.profile} key={"user-profile-description-" + user.id} />}
								{user != null && <UserFollowers viewedUser={user} style={{ 'margin-top': '20px' }} key={"user-profile-followers-" + user.id} />}
								{user != null && <UserFollowing viewedUser={user} style={{ 'margin-top': '20px' }} key={"user-profile-following-" + user.id} />}
							</LayoutGrid.Cell>
						</LayoutGrid.Inner>
					</LayoutGrid>
				</div>
			</div>
		);
	}
}

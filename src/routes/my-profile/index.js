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

@connect(state => state)
export default class MyProfile extends Component {

	componentDidMount () {
		const { auth, dispatch, vanity_url, user, path } = this.props;
		fetch_user(this.props.dispatch.bind(this), { token: auth.token, vanity_url: user.profile.url });
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ user }) {
		console.log(user);
		return (
			<div class={style.profile}>
				<div class={style.header}>
					<UserPictureName user={user.profile} show_location={true} />
				</div>
				<div class={style.profile_contents}>
					<LayoutGrid>
						<LayoutGrid.Inner>
							<LayoutGrid.Cell desktopCols="9" tabletCols="12">
								{user.tracks.length >= 1 && user.tracks.map( track => <div>
									{(<pre>{JSON.stringify(track, null, 2)}</pre>)}
								</div>)}
								{user.tracks.length <= 0 && <h1>No tracks</h1>}
							</LayoutGrid.Cell>
							<LayoutGrid.Cell desktopCols="3" tabletCols="12">
								{user != null && <UserDescription user={user.profile} />}
								{user != null && <UserFollowers viewedUser={user} style={{ 'margin-top': '20px' }} />}
								{/* {user != null && <UserFollowers viewedUser={user} style={{ 'margin-top': '20px' }} />} */}
							</LayoutGrid.Cell>
						</LayoutGrid.Inner>
					</LayoutGrid>
				</div>
			</div>
		);
	}
}

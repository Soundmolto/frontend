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

@connect(state => state)
export default class Profile extends Component {
	
	// gets called when this route is navigated to
	componentDidMount() {
		const { auth, dispatch, vanity_url, user, path } = this.props;
		if (path === "/me/") {
			fetch_user(this.props.dispatch.bind(this), { token: auth.token, vanity_url: user.profile.url });
			console.log(user.profile)
		} else {
			fetch_user(this.props.dispatch.bind(this), { token: auth.token, vanity_url });
		}
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ viewedUser }) {
		return (
			<div class={style.profile}>
				<div class={style.header}>
					<UserPictureName user={viewedUser} />
				</div>
				<div class={style.profile_contents}>
					<LayoutGrid>
						<LayoutGrid.Inner>
							<LayoutGrid.Cell desktopCols="9" tabletCols="12">
								{viewedUser.tracks.length >= 1 && viewedUser.tracks.map( track => <div>
									{(<pre>{JSON.stringify(track, null, 2)}</pre>)}
								</div>)}
								{viewedUser.tracks.length <= 0 && <h1>No tracks</h1>}
							</LayoutGrid.Cell>
							<LayoutGrid.Cell desktopCols="3" tabletCols="12">
								{viewedUser != null && <UserDescription user={viewedUser} />}
							</LayoutGrid.Cell>
						</LayoutGrid.Inner>
					</LayoutGrid>
				</div>
			</div>
		);
	}
}

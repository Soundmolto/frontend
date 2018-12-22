import { h, Component } from 'preact';
import style from './style';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';
import { connect } from 'preact-redux';
import { fetch_users, delete_user } from '../../actions/user';
import List from 'preact-material-components/List';
import Icon from 'preact-material-components/Icon';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Menu/style.css';
import Goku from '../../assets/goku.png';
import { route } from 'preact-router';
import { fetch_tracks } from '../../actions/track';

@connect(({ users, auth, user, tracks }) => ({ users, auth, user, tracks }))
export default class Admin extends Component {

	async delete_user (user) {
		const { dispatch, auth } = this.props;
		await delete_user(dispatch, { token: auth.token, user_id: user.id });
		await fetch_users(dispatch, auth.token);
	}

	async delete_track (track) {
		const { dispatch, auth } = this.props;
		await fetch_tracks(dispatch.bind(this), auth.token);
	}

	// gets called when this route is navigated to
	componentDidMount() {
		const { dispatch, auth } = this.props;
		fetch_users(dispatch.bind(this), auth.token);
		fetch_tracks(dispatch.bind(this), auth.token);
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ users, tracks = [] }) {
		if (this.props.user != null && (this.props.user.role !== 'admin' || this.props.user.role == null)) route('/', true);
		let index = 0;
		let get_class = () => {
			let className = style['height-fix'];
			if (index >= 1) {
				className = `${className} ${style['margin-top']}`;
			}
			index++;
			return className;
		}

		return (
			<div>
				<Helmet title={`${APP.NAME} - Admin Panel`} />
				<div class="header"><h1>Admin panel</h1></div>
				<LayoutGrid>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="6">
							<h3>Users</h3>
							<List>
								{users.map(user => (
									<List.Item class={get_class()}>
										<List.ItemGraphic>
											<img class={style.image} src={user.profile.profilePicture || Goku} />
										</List.ItemGraphic>
										<List.TextContainer>
											<List.PrimaryText>
												{user.profile.displayName || user.profile.url || user.id}
											</List.PrimaryText>
											<List.SecondaryText>
												Verified: {user.verified}
											</List.SecondaryText>
										</List.TextContainer>
										<List.ItemMeta>
											<Icon onClick={e => this.delete_user(user)}>delete</Icon>
										</List.ItemMeta>
									</List.Item>
								))}
							</List>
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="6">
							<h3>Tracks</h3>
							<List>
								{tracks.map(track => (
									<List.Item class={style['height-fix']}>
										<List.ItemGraphic>
											<img class={style.image} src={track.artwork || track.user.profilePicture || Goku} />
										</List.ItemGraphic>
										<List.TextContainer>
											<List.PrimaryText>
												{track.name || "Untitled track"}
											</List.PrimaryText>
											<List.SecondaryText>
												By: {track.user && (track.user.displayName || track.user.url) || track.owner}
											</List.SecondaryText>
										</List.TextContainer>
										<List.ItemMeta>
											<Icon onClick={e => this.delete_user(track)}>delete</Icon>
										</List.ItemMeta>
									</List.Item>
								))}
							</List>
						</LayoutGrid.Cell>
					</LayoutGrid.Inner>
				</LayoutGrid>
			</div>
		);
	}
}

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

@connect(({ users, auth, user }) => ({ users, auth, user }))
export default class Admin extends Component {

	async delete_user (user) {
		const { dispatch, auth } = this.props;
		await delete_user(dispatch, { token: auth.token, user_id: user.id });
		await fetch_users(dispatch, auth.token);
	}

	// gets called when this route is navigated to
	componentDidMount() {
        fetch_users(this.props.dispatch.bind(this), this.props.auth.token);
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ users }) {
		console.log(this.props.user.role);
		if (this.props.user != null && (this.props.user.role !== 'admin' || this.props.user.role == null)) {
			route('/', true);
		}
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
				<div class="header"><h1>Users <small style={{ fontSize: '0.8rem'}}>being deprecated</small></h1></div>
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
					</LayoutGrid.Inner>
				</LayoutGrid>
			</div>
		);
	}
}

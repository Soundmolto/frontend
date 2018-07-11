import { h, Component } from 'preact';
import style from './style';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';
import { connect } from 'preact-redux';
import { fetch_users } from '../../actions/user';
import List from 'preact-material-components/List';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Menu/style.css';
import Goku from '../../assets/goku.png';

@connect(({ users, auth }) => ({ users, auth }))
export default class Admin extends Component {

	// gets called when this route is navigated to
	componentDidMount() {
        fetch_users(this.props.dispatch.bind(this), this.props.auth.token);
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ users }) {
		return (
			<div>
				<Helmet title={`${APP.NAME} - Admin Panel`} />
				<div class="header"><h1>Users <small style={{ fontSize: '0.8rem'}}>being deprecated</small></h1></div>
				<div class={style.profile}>
					<List>
						{users.map(user => (
							<List.Item>
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
									<Icon onClick={e => console.log(user)}>delete</Icon>
								</List.ItemMeta>
							</List.Item>
						))}
					</List>
				</div>
			</div>
		);
	}
}

import { h, Component } from 'preact';
import 'preact-material-components/Button/style.css';
import { connect } from 'preact-redux';
import { fetch_users } from '../../actions/user';
import { UserCard } from '../../components/UserCard';
import style from './style';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';

@connect(({ users }) => ({ users }))
export default class Users extends Component {

	// gets called when this route is navigated to
	componentDidMount() {
        fetch_users(this.props.dispatch.bind(this));
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ users }) {
		return (
			<div>
				<Helmet title={`${APP.NAME} - Users`} />
				<div class="header"><h1>Users <small style={{ fontSize: '0.8rem'}}>being deprecated</small></h1></div>
				<div class={style.profile}>
					{users.map(user => (<UserCard user={user} />))}
				</div>
			</div>
		);
	}
}

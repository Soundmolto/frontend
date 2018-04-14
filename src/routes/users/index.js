import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import { connect } from 'preact-redux';
import { fetch_users } from '../../actions/user';
import { UserCard } from '../../components/UserCard';
import style from './style';

@connect(({ users }) => ({ users }))
export default class Users extends Component {

	// gets called when this route is navigated to
	componentDidMount() {
        fetch_users(this.props.dispatch.bind(this));
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ users }) {
		return (
			<div class={style.profile}>
				{users.map(user => (<UserCard user={user} />))}
			</div>
		);
	}
}

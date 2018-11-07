import { h, Component } from 'preact';
import 'preact-material-components/Button/style.css';
import { connect } from 'preact-redux';
import { fetch_following } from '../../actions/user';
import { UserCard } from '../../components/UserCard';
import style from './style';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';

@connect(({ following, auth, user }) => ({ following, auth, user }))
export default class Following extends Component {

	// gets called when this route is navigated to
	componentDidMount() {
		console.log(this.props.user);
		fetch_following(this.props.dispatch.bind(this), { token: this.props.auth.token, vanity_url: this.props.user.profile.url });
	}

	render({ following }) {
		console.log(following);
		return (
			<div>
				<Helmet title={`${APP.NAME} - Following`} />
				<div class="header"><h1>Users <small style={{ fontSize: '0.8rem'}}>being deprecated</small></h1></div>
				<div class={style.profile}>
					{following.map(user => (<UserCard user={{ profile: user }} />))}
				</div>
			</div>
		);
	}
}

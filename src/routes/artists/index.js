import { h, Component } from 'preact';
import 'preact-material-components/Button/style.css';
import { connect } from 'preact-redux';
import { fetch_following } from '../../actions/user';
import { UserCard } from '../../components/UserCard';
import style from './style';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';
import { route } from 'preact-router';

@connect(({ following, auth, user }) => ({ following, auth, user }))
export default class Following extends Component {

	// gets called when this route is navigated to
	componentDidMount() {
		fetch_following(this.props.dispatch.bind(this), { token: this.props.auth.token, vanity_url: this.props.user.profile.url });
	}

	render({ following, vanity_url, user }) {
		if (user == null || user.profile.url !== vanity_url) route('/', true);

		return (
			<div>
				<Helmet title={`${APP.NAME} - Artists`} />
				<div class="header">
					<h1>
						Artists
					</h1>
				</div>
				<div class={style.artists}>
					{following.map(user => (<UserCard user={{ profile: user }} />))}
				</div>
			</div>
		);
	}
}

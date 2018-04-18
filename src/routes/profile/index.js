import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import { connect } from 'preact-redux';
import { fetch_user } from '../../actions/user';
import style from './style';
import Goku from '../../assets/goku.png';

@connect(state => state)
export default class Profile extends Component {
	
	// gets called when this route is navigated to
	componentDidMount() {
		const { auth, dispatch, vanity_url } = this.props;
		fetch_user(this.props.dispatch.bind(this), { token: auth.token, vanity_url });
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ user }, { time, count }) {
		console.log(this);
		return (
			<div class={style.profile}>
				<div class={style.header}>
					<div class="vertical-center">
						<img src={Goku} />
						<h1>{user.profile.displayName || user.profile.url || "[Name]"}</h1>
					</div>	
				</div>
				<div class={style.profile_contents}>
					<h1>Profile: {user}</h1>
					<p>This is the user profile for a user named { user }.</p>

					<pre>
						{JSON.stringify(user, null, 2)}
					</pre>
				</div>
			</div>
		);
	}
}

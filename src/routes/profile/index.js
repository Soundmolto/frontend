import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import 'preact-material-components/Button/style.css';
import { connect } from 'preact-redux';
import { fetch_user } from '../../actions/user';
import style from './style';
import Goku from '../../assets/goku.png';
import { UserDescription } from '../../components/UserDescription';

@connect(state => state)
export default class Profile extends Component {
	
	// gets called when this route is navigated to
	componentDidMount() {
		const { auth, dispatch, vanity_url } = this.props;
		fetch_user(this.props.dispatch.bind(this), { token: auth.token, vanity_url });
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ user }, { time, count }) {
		return (
			<div class={style.profile}>
				<div class={style.header}>
					<div class="vertical-center">
						<img src={Goku} />
						<h1>{user.profile.displayName || user.profile.url || "[Name]"}</h1>
					</div>	
				</div>
				<div class={style.profile_contents}>
					{/* <h1>Profile: {user}</h1>
					<p>This is the user profile for a user named { user }.</p>

					<pre>
						{JSON.stringify(user, null, 2)}
					</pre> */}

					<LayoutGrid>
						<LayoutGrid.Inner>
							<LayoutGrid.Cell cols="10">
								{user.tracks.length >= 1 && user.tracks.map( track => <h1>Hello</h1>)}
								{user.tracks.length <= 0 && <h1>No tracks</h1>}
							</LayoutGrid.Cell>
							<LayoutGrid.Cell cols="2">
								{user != null && <UserDescription user={user} />}
							</LayoutGrid.Cell>
						</LayoutGrid.Inner>
					</LayoutGrid>
				</div>
			</div>
		);
	}
}

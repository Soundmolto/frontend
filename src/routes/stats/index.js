import { h, Component } from 'preact';
import { get_analytics } from '../../actions/analytics';
import { connect } from 'preact-redux';
import Helmet from 'preact-helmet';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import styles from './style.css'
import { route } from 'preact-router';
import { UserPictureName } from '../../components/UserPictureName';

@connect(({ auth, analytics }) => ({ auth, analytics }))
export default class Stats extends Component {

	componentDidMount () {
		get_analytics(this.props.dispatch, { token: this.props.auth.token });
	}

	render ({ auth, analytics }) {
		if (!auth.logged_in) route('/', true);
		const listeners = analytics.listeners || [];
		const tracks = analytics.user.tracks || [];
		let likes = 0;

		for (const track of tracks) {
			likes += track.amountOfLikes;
		}

		return (
			<div>
				<Helmet
					title={'SoundMolto - Your Stats'}
				/>
				<div class='header'>
					<h1>
						Your Stats
					</h1>
				</div>
				<div class={styles.container}>
					<div class={styles.general}>
						<Card class={`${styles.card} ${styles.plays}`}>
							<h3>Total plays</h3>
							<p>{analytics.totalPlays || 0}</p>
						</Card>

						<Card class={`${styles.card} ${styles.plays}`}>
							<h3>Total Likes</h3>
							<p>{likes}</p>
						</Card>

						<Card class={`${styles.card} ${styles.plays}`}>
							<h3>Total Followers</h3>
							<p>{analytics.user.followers.length || 0}</p>
						</Card>
					</div>

					<Card class={styles.card}>
						<h3>Top 10 listeners</h3>
						{listeners.map(listener =>
							<UserPictureName
								user={listener.profile}
								showUsername={true}
								show_location={true}
								class={styles.userPictureName}
								h1_class={styles.username}
							/>
						)}
					</Card>
				</div>
			</div>
		);
	}
}

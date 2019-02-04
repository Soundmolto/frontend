import { h, Component } from 'preact';
import { get_analytics } from '../../actions/analytics';
import { connect } from 'preact-redux';
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
		return (
			<div class={styles.container}>
				<Card class={styles.card}>
					<h3>Total plays</h3>
					<p>{analytics.totalPlays || 0}</p>
				</Card>

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
		);
	}
}

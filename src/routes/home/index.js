import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import style from './style';
import { TrackCard } from '../../components/TrackCard';
import { Link } from 'preact-router';
import { shortcuts } from '../../shortcuts';
import { get_discover_tracks } from '../../actions/track';
import { connect } from 'preact-redux';

@connect(({ discover }) => ({ discover }))
export default class Home extends Component {

	componentDidMount () {
		get_discover_tracks(this.props.dispatch);
	}

	onStartPlay (e) {
		console.log("wooo");
	}

	render ({ discover }) {
		return (
			<div>
				<div class="header">
					<h1>
						Home
					</h1>
				</div>
				<div class={style.home}>
					{console.log(discover)}
					{discover.map(track => (
						<TrackCard track={track} user={{ profile: track.user }} currentUser={{ profile: {} }} key={track.id} onStartPlay={this.onStartPlay.bind(this)}
							isCurrentTrack={false} />
					))}
				</div>
			</div>
		);
	}
}

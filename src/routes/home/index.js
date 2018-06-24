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
import { DiscoverCard } from '../../components/DiscoverCard';

@connect(({ discover }) => ({ discover }))
export default class Home extends Component {

	componentDidMount () {
		get_discover_tracks(this.props.dispatch);
	}

	render ({ discover }) {
		const sorted = discover.sort((aTrack, bTrack) => parseInt(bTrack.createdAt) - parseInt(aTrack.createdAt));
		return (
			<div>
				<div class="header">
					<h1>
						Discover
					</h1>
				</div>
				<div class={style.home}>
					{sorted.map(track => (
						<DiscoverCard track={track} user={track.user} />
					))}
				</div>
			</div>
		);
	}
}

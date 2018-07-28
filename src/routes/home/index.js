import { h, Component } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import { get_discover_tracks } from '../../actions/track';
import { connect } from 'preact-redux';
import { DiscoverCard } from '../../components/DiscoverCard';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';

@connect(({ discover }) => ({ discover }))
export default class Home extends Component {

	componentDidMount () {
		get_discover_tracks(this.props.dispatch);
	}

	onStartPlay (track) {
		const { queue } = this.props;
		const tracks = [].concat(this.sorted);
		let i = 0;

		for (const index in tracks) {
			if (tracks[index].id === track.id) {
				i = index;
			}
		}

		queue.title = `Discover`;
		queue.tracks = [].concat(tracks);
		queue.position = i;
	}

	render ({ discover }) {
		this.sorted = discover.sort((aTrack, bTrack) => parseInt(bTrack.createdAt) - parseInt(aTrack.createdAt));
		return (
			<div>
				<Helmet title={`${APP.NAME} - Discover`} />
				<div class="header">
					<h1>
						Discover
					</h1>
				</div>
				<LayoutGrid>
					<LayoutGrid.Inner>
						{this.sorted.map(track => (
							<LayoutGrid.Cell desktopCols="3" tabletCols="4" phoneCols="12">
								<DiscoverCard track={track} user={track.user} onClick={this.onStartPlay.bind(this)} />
							</LayoutGrid.Cell>
						))}
					</LayoutGrid.Inner>
				</LayoutGrid>
			</div>
		);
	}
}

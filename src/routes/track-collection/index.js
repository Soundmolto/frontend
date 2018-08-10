import { h, Component } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import List from 'preact-material-components/List';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/List/style.css';
import 'preact-material-components/LayoutGrid/style.css';
import { get_track_collection } from '../../actions/track';
import { connect } from 'preact-redux';
import { DiscoverCard } from '../../components/DiscoverCard';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';
import styles from './style';

@connect(({ auth, currently_playing, trackCollection }) => ({ auth, currently_playing, trackCollection }))
export default class TrackCollection extends Component {

	componentDidMount () {
		get_track_collection(this.props.dispatch, this.props.auth.token);
	}

	onStartPlay (track) {
		const { queue } = this.props;
		const tracks = [].concat(this.sorted);
		let i = 0;

		for (const index in tracks) {
			if (tracks[index].id === track.id) {
				i = parseInt(index);
			}
		}

		queue.title = `Discover`;
		queue.tracks = [].concat(tracks);
		queue.position = i || 0;
	}

	render ({ trackCollection, currently_playing }) {
		this.sorted = trackCollection.sort((aTrack, bTrack) => parseInt(bTrack.createdAt) - parseInt(aTrack.createdAt));
		return (
			<div>
				<Helmet title={`${APP.NAME} - Songs`} />
				<div class={`header ${styles.header}`}>
					<h1>
						Songs
					</h1>
				</div>
				<div class={styles.home}>
					<List>
						{this.sorted.length >= 1 && this.sorted.map(track => (
							<List.Item>
								{console.log(currently_playing)}
								<List.ItemGraphic class={styles.hover}>
									<Icon>
										{(currently_playing.track && currently_playing.track.id === track.id && currently_playing.playing) ? 'pause' : 'play_arrow' }
									</Icon>
								</List.ItemGraphic>
								<List.TextContainer>
									<List.PrimaryText>
										{track.name} - {track.user.displayName}
									</List.PrimaryText>
									<List.SecondaryText>
										aa
									</List.SecondaryText>
								</List.TextContainer>
								<List.ItemMeta>
									<Icon onClick={e => this.delete_user(user)}>delete</Icon>
								</List.ItemMeta>
							</List.Item>
						))}
					</List>
				</div>
				{/* <LayoutGrid>
					<LayoutGrid.Inner>
							
							{this.sorted.length === 0 && (
								<LayoutGrid.Cell desktopCols="12" tabletCols="12" phoneCols="12">
									<div class="mdc-custom-card">
										Hmm. looks you have no saved tracks.
									</div>
								</LayoutGrid.Cell>
							)}
					</LayoutGrid.Inner>
				</LayoutGrid> */}
			</div>
		);
	}
}

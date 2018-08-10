import { h, Component } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import List from 'preact-material-components/List';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/List/style.css';
import 'preact-material-components/LayoutGrid/style.css';
import { get_track_collection } from '../../actions/track';
import { connect } from 'preact-redux';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';
import styles from './style';
import { TrackListItem } from '../../components/TrackListItem/TrackListItem';

@connect(({ auth, trackCollection }) => ({ auth, trackCollection }))
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

		queue.title = `Songs`;
		queue.tracks = [].concat(tracks);
		queue.position = i || 0;
	}

	render ({ trackCollection }) {
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
						<List.Item class={styles['list-item']}>
							<List.ItemGraphic class={styles.hover}>
								<Icon></Icon>
							</List.ItemGraphic>
							<List.TextContainer class={styles.container}>
								<LayoutGrid class={styles.grid}>
									<LayoutGrid.Inner class={styles['grid-inner']}>
										<LayoutGrid.Cell desktopCols="6" tabletCols="6" phoneCols="6">
											<List.PrimaryText>
												Track
											</List.PrimaryText>
										</LayoutGrid.Cell>
										<LayoutGrid.Cell desktopCols="6" tabletCols="6" phoneCols="6">
											<Icon>access_time</Icon>
										</LayoutGrid.Cell>
									</LayoutGrid.Inner>
								</LayoutGrid>
							</List.TextContainer>
							<List.ItemMeta>
								<Icon style={{ 'margin-right': 10, opacity: 0 }}>cloud_download</Icon>
								<Icon style={{ opacity: 0 }}>check</Icon>
							</List.ItemMeta>
						</List.Item>
						{this.sorted.length >= 1 && this.sorted.map(track => (
							<TrackListItem onClick={this.onStartPlay.bind(this)} track={track} user={track.user} />
						))}

						{this.sorted.length === 0 && (
							<List.Item class={styles['list-item']}>
								<List.ItemGraphic class={styles.hover}>
									<Icon />
								</List.ItemGraphic>
								<List.TextContainer class={styles.container}>
									<LayoutGrid class={styles.grid}>
										<LayoutGrid.Inner class={styles['grid-inner']}>
											<LayoutGrid.Cell desktopCols="12" tabletCols="12" phoneCols="12">
												<List.PrimaryText>
													Looks like you have no saved tracks!
												</List.PrimaryText>
											</LayoutGrid.Cell>
										</LayoutGrid.Inner>
									</LayoutGrid>
								</List.TextContainer>
								<List.ItemMeta>
									<Icon style={{ 'margin-right': 10, opacity: 0 }}>cloud_download</Icon>
									<Icon style={{ opacity: 0 }}>check</Icon>
								</List.ItemMeta>
							</List.Item>
						)}
					</List>
				</div>
			</div>
		);
	}
}

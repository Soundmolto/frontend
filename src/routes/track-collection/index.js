import { h, Component } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import List from 'preact-material-components/List';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/List/style.css';
import 'preact-material-components/LayoutGrid/style.css';
import { get_track_collection, remove_track_from_collection } from '../../actions/track';
import { connect } from 'preact-redux';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';
import styles from './style';
import { TrackListItem } from '../../components/TrackListItem';
import { SETTINGS } from '../../enums/settings';
import { route } from 'preact-router';

@connect(({ auth, settings, trackCollection }) => ({ auth, settings, trackCollection }))
export default class TrackCollection extends Component {

	state = { sortBy: 'track', sortDir: 'asc' };

	componentDidMount () {
		get_track_collection(this.props.dispatch, this.props.auth.token);
	}

	onRemoveItem (track) {
		const { auth, dispatch } = this.props;
		const { token } = auth;
		remove_track_from_collection(dispatch, { token, id: track.id });
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

	onClickSortByTime () {
		let sortDir = 'asc';
		if (this.state.sortBy === 'time' && this.state.sortDir === 'asc') sortDir = 'desc';
		this.setState({ sortBy: 'time', sortDir });
	}

	onClickSortByTrack () {
		let sortDir = 'asc';
		if (this.state.sortBy === 'track' && this.state.sortDir === 'asc') sortDir = 'desc';
		this.setState({ sortBy: 'track', sortDir });
	}

	sort (collection) {
		const { sortBy, sortDir } = this.state;
		let sorted = collection;
		const getUserName = track => track.user.displayName || track.user.url;
		if (sortBy !== 'default') {
			switch (sortBy) {
				case "time": {
					sorted = sorted.sort((first, second) => first.duration - second.duration);
					if (sortDir === 'desc') sorted = sorted.reverse();
					break;
				}

				case "track": {
					sorted = sorted.sort((first, second) => {
						return `${getUserName(first)} - ${first.name}`.localeCompare(`${getUserName(second)} - ${second.name}`)
					});

					if (sortDir === 'desc') sorted = sorted.reverse();
					break;
				}

				default: {
					sorted = collection;
					break;
				}
			}
		}
		return [].concat(sorted);
	}

	render ({ auth, settings, trackCollection }, { sortBy, sortDir}) {
		if (settings.beta === SETTINGS.DISABLE_BETA || auth.token == null) route('/', true);
		this.sorted = this.sort(trackCollection);
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
						{window.innerWidth >= 768 && (
							<List.Item class={styles['list-item']}>
								<div style={{ width: '100px' }}></div>
								<List.ItemGraphic class={styles.hover}>
									<Icon></Icon>
								</List.ItemGraphic>
								<List.TextContainer class={styles.container}>
									<LayoutGrid class={styles.grid}>
										<LayoutGrid.Inner class={styles['grid-inner']}>
											<LayoutGrid.Cell desktopCols="4" tabletCols="4" phoneCols="4">
												<List.PrimaryText>
													<span onClick={this.onClickSortByTrack.bind(this)} class={`${styles.hover} ${styles.centered}`}>
														Track
														{sortBy === 'track' && (
															<Icon class={styles.activeSort}>
																{sortDir === 'desc' && ('keyboard_arrow_down')}
																{sortDir === 'asc' && ('keyboard_arrow_up')}
															</Icon>
														)}
													</span>
												</List.PrimaryText>
											</LayoutGrid.Cell>
											<LayoutGrid.Cell desktopCols="4" tabletCols="4" phoneCols="4">
												<List.PrimaryText>
													<span onClick={this.onClickSortByTrack.bind(this)} class={`${styles.hover} ${styles.centered}`}>
														Artist
														{sortBy === 'artist' && (
															<Icon class={styles.activeSort}>
																{sortDir === 'desc' && ('keyboard_arrow_down')}
																{sortDir === 'asc' && ('keyboard_arrow_up')}
															</Icon>
														)}
													</span>
												</List.PrimaryText>
											</LayoutGrid.Cell>
											<LayoutGrid.Cell desktopCols="4" tabletCols="4" phoneCols="4">
												<span onClick={this.onClickSortByTime.bind(this)} class={styles.hover}>
													<Icon>access_time</Icon>
													{sortBy === 'time' && (
														<Icon class={styles.activeSort}>
															{sortDir === 'desc' && ('keyboard_arrow_down')}
															{sortDir === 'asc' && ('keyboard_arrow_up')}
														</Icon>
													)}
												</span>
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
						{this.sorted.length >= 1 && this.sorted.map(track => (
							<TrackListItem
								onClick={this.onStartPlay.bind(this)}
								track={track}
								user={track.user}
								onRemoveItem={this.onRemoveItem.bind(this)}
								showArtwork={true}
							/>
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

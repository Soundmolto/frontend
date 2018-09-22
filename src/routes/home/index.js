import { h, Component } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/LayoutGrid/style.css';
import { get_discover_tracks, get_more_discover_tracks } from '../../actions/track';
import { connect } from 'preact-redux';
import { DiscoverCard } from '../../components/DiscoverCard';
import Helmet from 'preact-helmet';
import InfiniteScroll from 'react-infinite-scroller';
import { APP } from '../../enums/app';
import styles from './style';
import { FilterableGenre } from '../../components/FilterableGenre';
import Stretch from 'styled-loaders/lib/components/Stretch';

let hasMore = true;
const loader = (<div key={0}><Stretch color="#c67dcb" /></div>);

@connect(({ auth, discover }) => ({ auth, discover }))
export default class Home extends Component {

	sortingBy = '';

	componentDidMount () {
		get_discover_tracks(this.props.dispatch, this.props.auth.token);
	}

	loadMore = () => get_more_discover_tracks(this.props.dispatch, this.props.discover.nextUrl, this.props.auth.token);

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

	filterByGenre = (genre) => {
		if (genre != null) {
			this.filterBy = track => track.genres.indexOf(genre) !== -1;
			this.sortingBy = genre;
		} else {
			this.filterBy = null;
			this.sortingBy = '';
		}
		this.forceUpdate();
	}

	getGenres (tracks) {
		let genres = [];

		for (const track of tracks) {
			for (const genre of track.genres) {
				if (genres.indexOf(genre) === -1) {
					genres.push(genre);
				}
			}
		}
		return genres;
	}

	sortTracks (discover) {
		let sorted = discover.sort((aTrack, bTrack) => parseInt(bTrack.createdAt) - parseInt(aTrack.createdAt));
		if (this.filterBy != null) {
			sorted = sorted.filter(this.filterBy);
		}

		return sorted;
	}

	render ({ discover }) {
		console.log(discover)
		const infiniteScrollStyle = { display: "inline-block", width: '100%' };
		const tracks = discover.tracks || [];
		const nextUrl = discover.nextUrl || '';
		const genres = this.getGenres(tracks);
		this.sorted = tracks;
		hasMore = discover.hasMore;

		return (
			<div>
				<Helmet title={`${APP.NAME} - Discover`} />
				<div class="header">
					<h1>
						Discover
					</h1>
				</div>
				<LayoutGrid>
						{genres.length >= 1 && (
							<LayoutGrid.Inner>
								<LayoutGrid.Cell desktopCols="12" tabletCols="12" phoneCols="12">
									<span class={styles.genresContainer}>
										<span class={styles.forceLeft}>
											{this.filterBy == null ? (
												<Icon>filter_list</Icon>
											): (
												<Icon class={styles.closable} onClick={e => this.filterByGenre(null)}>close</Icon>
											)}
											
											<span>Filter by genre</span>
										</span>
										<span>
											{genres.map(genre => (
												<FilterableGenre genre={genre} onFilterByGenre={this.filterByGenre} sortingBy={this.sortingBy} />
											))}
										</span>
									</span>
								</LayoutGrid.Cell>
							</LayoutGrid.Inner>
						)}
					{this.sorted.length >= 1 && (
						<InfiniteScroll pageStart={0} loadMore={this.loadMore} hasMore={hasMore} style={infiniteScrollStyle} loader={loader}>
							<LayoutGrid.Inner>
								{this.sorted.map(track => (
										<LayoutGrid.Cell desktopCols="4" tabletCols="4" phoneCols="12">
											<DiscoverCard track={track} user={track.user} onClick={this.onStartPlay.bind(this)} />
										</LayoutGrid.Cell>
								))}
							</LayoutGrid.Inner>

						</InfiniteScroll>
					)}
						
						{this.sorted.length === 0 && (
							<LayoutGrid.Inner>
								<LayoutGrid.Cell desktopCols="12" tabletCols="12" phoneCols="12">
									<div class="mdc-custom-card">
										Hmm. looks you're not following anyone who has uploaded music recently.
									</div>
								</LayoutGrid.Cell>
							</LayoutGrid.Inner>
						)}
				</LayoutGrid>
			</div>
		);
	}
}

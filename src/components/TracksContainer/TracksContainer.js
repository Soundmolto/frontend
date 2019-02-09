import InfiniteScroll from 'react-infinite-scroller';
import Stretch from 'styled-loaders/lib/components/Stretch';
import { TrackCard } from '../TrackCard';
import { TrackListItem } from '../TrackListItem';
import 'preact-material-components/List/style.css';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import List from 'preact-material-components/List';
import Icon from 'preact-material-components/Icon';
import style from './style';

const loader = (<div key={0}><Stretch color="#c67dcb" /></div>);
const infiniteScrollStyle = { display: "inline-block", width: '100%' };
let hasMore = false;

const renderTrackCard = (track, viewedUser, user, onStartPlay, onDelete, onReportTrack, onShareTrack) => (
	<TrackCard
		track={track}
		user={viewedUser}
		currentUser={user}
		key={track.id}
		isCurrentTrack={false}
		onStartPlay={onStartPlay}
		onDelete={() => onDelete(track)}
		onReportTrack={onReportTrack}
		onShareTrack={() => onShareTrack(track)}
	/>
);

const renderTrackListItem = (track, onStartPlay, onDelete, onReportTrack, onShareTrack) => (
	<TrackListItem
		showArtwork={true}
		showExtraStats={true}
		onClick={onStartPlay}
		track={track}
		user={track.user}
		onDelete={() => onDelete(track)}
		onReportTrack={onReportTrack}
		onShareTrack={() => onShareTrack(track)}
	/>
);

export const TracksContainer = ({ tracks, shouldRenderWaveform, onStartPlay, viewedUser, user, onDelete, onReportTrack, onShareTrack }) => (
	<InfiniteScroll pageStart={0} loadMore={this.loadMore} hasMore={hasMore} style={infiniteScrollStyle} loader={loader}>
			{shouldRenderWaveform ?
				tracks.map(track => renderTrackCard(track, viewedUser, user, onStartPlay, onDelete, onReportTrack, onShareTrack)) : (
				<List class={style.listContainer}>
					{window.innerWidth >= 768 && (
						<List.Item class={style['list-item']}>
							<div style={{ width: '100px' }}></div>
							<List.ItemGraphic class={style.hover}>
								<Icon></Icon>
							</List.ItemGraphic>
							<List.TextContainer class={style.container}>
								<LayoutGrid class={style.grid}>
									<LayoutGrid.Inner class={style['grid-inner']}>
										<LayoutGrid.Cell desktopCols="4" tabletCols="4" phoneCols="4">
											<List.PrimaryText class={style.fixHeight}>
												<span class={style.centered}>
													Track
												</span>
											</List.PrimaryText>
										</LayoutGrid.Cell>
										<LayoutGrid.Cell desktopCols="4" tabletCols="4" phoneCols="4">
											<List.PrimaryText class={style.fixHeight}>
												<span class={style.centered}>
													Artist
												</span>
											</List.PrimaryText>
										</LayoutGrid.Cell>
										<LayoutGrid.Cell desktopCols="4" tabletCols="4" phoneCols="4">
											<span>
												<Icon>access_time</Icon>
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
					
					{tracks.map(track => renderTrackListItem(track, onStartPlay, onDelete, onReportTrack, onShareTrack))}
				</List>)
			}
		</InfiniteScroll>
)
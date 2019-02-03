import { Component } from "preact";
import List from 'preact-material-components/List';
import Icon from 'preact-material-components/Icon';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/List/style.css';
import 'preact-material-components/LayoutGrid/style.css';
import { seconds_to_time } from "../../utils/seconds-to-time";
import { playing_now, save_track_in_collection, remove_track_from_collection } from "../../actions/track";
import { connect } from 'preact-redux';
import styles from './style.css';
import { TrackCollectionIndicator } from "../TrackCollectionIndicator";
import { LikeIndicator } from "../LikeIndicator";
import Goku from '../../assets/goku.png';

@connect( ({ auth, currently_playing }) => ({ auth, currently_playing }))
export class TrackListItem extends Component {

	state = { playing: false, icon: 'check', opacity: 0 };

	componentWillMount () {
		if (this.props.track.downloadable === "true") {
			this.state.opacity = 1;
		}
	}

	listItemRef = e => (this.listItem = e);

	onStartPlay (e) {
		const { currently_playing, dispatch, track, user, onClick } = this.props;
		let position = 0;
		e.preventDefault();
		e.stopImmediatePropagation();
		e.currentTarget.blur();
		this.setState({ playing: !this.state.playing });
		onClick(track);
		this.played = true;

		if (currently_playing.track && track.id === currently_playing.track.id) {
			const audio = document.querySelector('audio') || { currentTime: currently_playing.position };
			position = audio.currentTime;
		}

		playing_now(dispatch, { playing: this.state.playing, track, owner: user, position });
	}

	onClick (e) {
		this.props.onRemoveItem(this.props.track);
	}

	mouseOver (e) {
		this.setState({ icon: 'close' });
	}

	mouseOut (e) {
		this.setState({ icon: 'check' });
	}

	massageState () {
		const { currently_playing, track } = this.props;
		const { playing } = this.state;
		if (playing === false && currently_playing.track != null && track.id === currently_playing.track.id && currently_playing.playing === true) {
			this.setState({ playing: true });
		}

		if (playing && currently_playing.track != null && track.id !== currently_playing.track.id) {
			this.setState({ playing: false });
		}

		if (currently_playing.playing === false && currently_playing.track != null && playing && track.id === currently_playing.track.id) {
			this.setState({ playing: false });
		}
	}

	saveTrackToCollection () {
		save_track_in_collection(this.props.dispatch, { token: this.props.auth.token, id: this.props.track.id });
	}

	removeTrackFromCollection () {
		remove_track_from_collection(this.props.dispatch, { token: this.props.auth.token, id: this.props.track.id });
	}

	getArtwork (track, user) {
		const userAvatar = user && user.profilePicture;
		const trackArtwork = track && track.artwork;
		return trackArtwork || userAvatar || Goku;
	}

	render ({ track, showArtwork, showExtraStats }, { playing, opacity }) {
		this.massageState();
		track.user = track.user || { url: '' };

		return (
			<List.Item class={styles['list-item']}>
				{showArtwork === true && (
					<img src={this.getArtwork(track, this.props.user)} class={styles.image} />
				)}
				<List.ItemGraphic class={styles.hover}>
					<Icon onClick={this.onStartPlay.bind(this)}>
						{(playing) ? 'pause' : 'play_arrow' }
					</Icon>
				</List.ItemGraphic>
				<List.TextContainer class={styles.container}>
					<LayoutGrid class={styles.grid}>
						<LayoutGrid.Inner class={styles['grid-inner']}>
							<LayoutGrid.Cell desktopCols="4" tabletCols="4" phoneCols="4">
								<List.PrimaryText>
									<a href={`/${track.user.url}/${track.url}`} class={styles.link}>
										{track.name}
									</a>
								</List.PrimaryText>
							</LayoutGrid.Cell>
							<LayoutGrid.Cell desktopCols="4" tabletCols="4" phoneCols="4">
								<List.PrimaryText>
								<a href={`/${track.user.url}`} class={styles.link}>
										{track.user.displayName}
									</a>
								</List.PrimaryText>
							</LayoutGrid.Cell>
							<LayoutGrid.Cell desktopCols="4" tabletCols="4" phoneCols="4">
								<List.SecondaryText className={styles.timeContainer}>
									<p class={styles.time}>
										{seconds_to_time(track.duration).rendered}
									</p>
								</List.SecondaryText>
							</LayoutGrid.Cell>
						</LayoutGrid.Inner>
					</LayoutGrid>
				</List.TextContainer>
				{this.props.onRemoveItem != null && (
					<List.ItemMeta>
						<Icon style={{ 'margin-right': 10, opacity }}>cloud_download</Icon>
						<Icon class={styles.hover} onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)}
							onMouseEnter={this.mouseOver.bind(this)} onMouseLeave={this.mouseOut.bind(this)} onClick={this.onClick.bind(this)}>
							{this.state.icon}
						</Icon>
					</List.ItemMeta>
				)}
				{showExtraStats == true && (
					<List.ItemMeta class={styles.itemMeta}>
						<LikeIndicator
							track={track}
							className={styles.likeContainer}
						/>
						<TrackCollectionIndicator
							track={track}
							inCollection={track.inCollection}
							onSaveTrackToCollection={this.saveTrackToCollection.bind(this)}
							onRemoveTrackFromCollection={this.removeTrackFromCollection.bind(this)}
							className={styles.trackCollectionIndicator}
						/>
					</List.ItemMeta>
				)}
			</List.Item>
		);
	}
}
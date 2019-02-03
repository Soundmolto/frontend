import { Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import { Waveform } from '../Waveform';
import Icon from 'preact-material-components/Icon';
import IconToggle from 'preact-material-components/IconToggle';
import { playing_now, delete_track, toggle_like, save_track_in_collection, remove_track_from_collection } from '../../actions/track';
import { connect } from 'preact-redux';
import { seconds_to_time } from '../../utils/seconds-to-time';
import { TrackCollectionIndicator } from "../TrackCollectionIndicator";
import { SETTINGS } from '../../enums/settings';
import dayjs from 'dayjs';
import TimeAgo from 'timeago-react';
import Goku from '../../assets/goku.png';
import approximateNumber from 'approximate-number';
import 'preact-material-components/IconToggle/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Snackbar/style.css';
import styles from './style';
import { start_editing_track } from '../../actions/editingTrack';
import { ShareTrack } from '../ShareTrack';

@connect(({ auth, currently_playing, settings }) => ({ auth, currently_playing, settings }))
export class TrackCard extends Component {

	plays = 0;
	played = false;

	state = { playing: false, inCollection: false  };

	componentDidMount () {
		this.plays = this.props.track.plays;
	}

	componentWillUnmount () {
		this.setState({ playing: false });
		this.plays = 0;
		this.played = false;
	}

	componentWillMount () {
		this.setState({ inCollection: this.props.track.inCollection });
	}

	onClickPlayPause = e => {
		console.log('yeah');
		e.preventDefault();
		e.stopImmediatePropagation();
		e.currentTarget.blur();
		this.setState({ playing: !this.state.playing });
		this.props.onStartPlay(this.props.track);
		this.played = true;
		const position = this.props.currently_playing.position;
		const audio = document.querySelector('audio') || { currentTime: position };
		

		playing_now(this.props.dispatch, {
			playing: this.state.playing,
			track: this.props.track,
			owner: this.props.viewedUser,
			position: audio.currentTime
		});
	}

	onTogglePlay (playing, pos) {
		this.setState({ playing, pos });
		this.props.onStartPlay(this.props.track);
		this.played = true;

		playing_now(this.props.dispatch, {
			playing: this.state.playing,
			position: pos || 0,
			track: this.props.track,
			owner: this.props.user
		});
	}

	onClickEditTrack () {
		const { dispatch, track } = this.props;
		start_editing_track(dispatch, { track });
	}

	onClickReportTrack = (event) => {
		this.props.onReportTrack(this.props.track);
	}

	getArtwork (track, user) {
		const userAvatar = user && user.profilePicture;
		const trackArtwork = track && track.artwork;
		return trackArtwork || userAvatar || Goku;
	}

	saveTrackToCollection () {
		save_track_in_collection(this.props.dispatch, { token: this.props.auth.token, id: this.props.track.id });
	}

	removeTrackFromCollection () {
		remove_track_from_collection(this.props.dispatch, { token: this.props.auth.token, id: this.props.track.id });
	}

	onClickShare = () => {
		this.props.onShareTrack(this.props.track);
	}

	render ({ track, user, currentUser, currently_playing, isCurrentTrack, settings, onDelete }, { inCollection }) {
		const userLikesTrack = user.likes && user.likes.filter(like => like.id === track.id).length != 0;
		const postedAt = dayjs(parseInt(track.createdAt));
		const toggleOnIcon = { content: "favorite", label: "Remove From Favorites" };
		const toggleOffIcon = { content: "favorite_border", label: "Add to Favorites" };
		let posted = postedAt.format('DD-MM-YYYY');

		if (posted.indexOf("NaN") !== -1) {
			posted = "Unavaliable - Parsing error";
		}

		if (this.played === false ) {
			this.plays = track.plays;
		}

		if (this.state.playing === false && currently_playing.track != null && track.id === currently_playing.track.id && currently_playing.playing === true) {
			this.setState({ playing: true });
		}

		if (this.state.playing && currently_playing.track != null && track.id !== currently_playing.track.id) {
			this.setState({ playing: false });
		}

		if (currently_playing.playing === false && currently_playing.track != null && this.state.playing && track.id === currently_playing.track.id) {
			this.setState({ playing: false });
		}

		return (
			<div class={styles.card}>
				<Card class={styles.cardRoot} onClick={() => console.log('fuck sake')}>
					<div class={styles.image} style={{ 'background-image': `url(${this.getArtwork(track, track.user)})` }} onClick={() => console.log('fuck sake')}>
						<Button class={styles['play-button']} onClick={this.onClickPlayPause}>
							<Icon>
								{!this.state.playing && 'play_arrow'}
								{this.state.playing && 'pause'}
							</Icon>
						</Button>
					</div>
					<span class={styles.dateContainer}>
						{track.genres != null && track.genres.length >= 1 && (
							<div class={styles.genres}>
								{track.genres.map && track.genres.map(genre => (<span>{genre}</span>))}
							</div>
						)}
						<TimeAgo
							datetime={postedAt.toDate()} 
							locale='en_AU'
							className={styles.date}
							title={`Posted on ${postedAt.format('DD MMMM YYYY')}`}
						/>
						{track.visibility !== 'public' && (
							<span className={styles.privateStatus}>
								<Icon>lock</Icon> Private
							</span>
						)}
					</span>
					{isCurrentTrack === true && (
						<h4 class={styles.displayName}>
							<a class={styles.link} href={`/${user.profile.url}`}>
								{user.profile.displayName || user.profile.url || "N/A"}
							</a>
						</h4>
					)}
					{isCurrentTrack == false && (
						<h4 class={styles.displayName}>{user.profile.displayName || user.profile.url || "N/A"}</h4>
					)}
					<h2 class={`mdc-typography--title ${styles.username}`}>
						{isCurrentTrack == false && (
							<a class={styles.link} href={`/${user.profile.url}/${track.url}`}>
								{track.name}
							</a>
						)}
						{isCurrentTrack == true && (
							track.name
						)}
					</h2>
					<Waveform
						ref={e => (this.waveform = e)}
						data={track}
						key={track.id}
						parentPlaying={this.state.playing}
						isCurrentTrack={isCurrentTrack}
						onClickContainer={position => this.onTogglePlay(true, position)}
					/>
					<div class={styles.hiddenMobile}>
						<p class={`${styles.centered} ${styles.plays}`}>
							<Icon>headset</Icon> {approximateNumber(this.plays, { capital: true, round: true })}
						</p>
						<p class={`${styles.centered} ${styles.favorites}`}>
							<IconToggle
								role="button"
								tabindex="0"
								aria-pressed={userLikesTrack}
								aria-label="Add to favorites"
								data-toggle-on={toggleOnIcon}
								data-toggle-off={toggleOffIcon}
								onClick={e => toggle_like(this.props.dispatch, { token: this.props.auth.token, id: track.id, user: this.props.track.user })}>
								{userLikesTrack === true && "favorite"}
								{userLikesTrack === false && "favorite_border"}
							</IconToggle>
							{track.amountOfLikes || 0}
						</p>
						<p class={`${styles.centered} ${styles.favorites}`}>
							<ShareTrack onClick={this.onClickShare} />
						</p>
						<p class={`${styles.centered} ${styles.favorites}`}>
							{settings.beta === SETTINGS.ENABLE_BETA && (
								<TrackCollectionIndicator
									track={track}
									inCollection={inCollection}
									onSaveTrackToCollection={this.saveTrackToCollection.bind(this)}
									onRemoveTrackFromCollection={this.removeTrackFromCollection.bind(this)}
								/>
							)}
						</p>
						<span style={{ 'font-size': '0.9rem', float: 'right', 'margin-top': '14px' }}>
							<p class={`${styles.centered} prel ${styles.w100}`} >
								<span>
									{seconds_to_time(track.duration).rendered}
								</span>
							</p>
						</span>
						{user.profile.id === currentUser.profile.id && (
							<span>
								<p class={`${styles.centered} ${styles.actionable}`} style={{ 'float': 'right', 'margin-top': '14px' }} onClick={onDelete}>
									<Icon style={{ margin: 0 }}>delete</Icon>
								</p>
								<p class={`${styles.centered} ${styles.actionable}`} style={{ 'float': 'right', 'margin-top': '14px' }} onClick={this.onClickEditTrack.bind(this)}>
									<Icon style={{ margin: 0 }}>edit</Icon>
								</p>
							</span>
						)}
						<span>
							<p class={`${styles.centered} ${styles.actionable}`} style={{ 'float': 'right', 'margin-top': '14px' }} onClick={this.onClickReportTrack}>
								<Icon style={{ margin: 0 }}>report</Icon>
							</p>
						</span>
					</div>
				</Card>
			</div>
		);
	}
}
import { Component } from "preact";
import Button from "preact-material-components/Button";
import Card from 'preact-material-components/Card';
import Icon from 'preact-material-components/Icon';
import Goku from '../../assets/goku.png';
import { route } from "preact-router";
import { seconds_to_time } from "../../utils/seconds-to-time";
import { playing_now, save_track_in_collection, remove_track_from_collection } from "../../actions/track";
import { connect } from 'preact-redux';
import { SETTINGS } from '../../enums/settings';
import dayjs from 'dayjs';
import TimeAgo from 'timeago-react';
import { TrackCollectionIndicator } from "../TrackCollectionIndicator";
import approximateNumber from 'approximate-number';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import styles from './style.css';
import { LikeIndicator } from "../LikeIndicator";

@connect( ({ auth, currently_playing, settings }) => ({ auth, currently_playing, settings }))
export class DiscoverCard extends Component {

	state = { playing: false, inCollection: false };

	goTo (e, path) {
		e.preventDefault();
		route(path);
	}

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

	componentWillMount () {
		this.setState({ inCollection: this.props.track.inCollection });
	}

	render ({ currently_playing, track, user, settings }, { playing, icon, inCollection }) {
		const artwork = this.getArtwork(track, (track.user || user));
		const postedAt = dayjs(parseInt(track.createdAt));

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
			<Card style={{ overflow: 'hidden' }}>
				<div class={`${styles.paddingAll} ${styles.flexible}`}>
					<Button onClick={this.onStartPlay.bind(this)}>
						{playing === false && (<Icon>play_arrow</Icon>)}
						{playing === true && (<Icon>pause</Icon>)}
					</Button>
					<div style={{ display: 'block', width: 'calc(100% - 64px)', position: 'relative' }}>
						<h2 class={`mdc-typography--title ${styles.noOverflow}`}>
							<a href={`/${(user && user.url || '')}`}>
								{(user && user.displayName) || "Untitled user"}
							</a>
						</h2>
						<div class={`mdc-typography--caption ${styles.noOverflow}`}>
							<a href={`/${(user && user.url)}/${track.url}`}>
								{track.name}
							</a>
						</div>
						<TimeAgo
							datetime={postedAt.toDate()} 
							locale='en_AU'
							className={styles.date}
							title={`Posted on ${postedAt.format('DD MMMM YYYY')}`}
							style={track.visibility !== 'public' && { marginRight: '40px' }}
						/>
						{track.visibility !== 'public' && (
							<span class={styles.private}>
								<Icon>lock</Icon>
							</span>
						)}
					</div>
				</div>
				<Card.Media className={`card-media ${styles.cardMedia}`}>
					<div class={styles.blur} style={{ 'background-image': `url(${artwork})` }}></div>
					{track.genres && track.genres.length !== 0 && (
						<span class={styles.genre}>{track.genres[0]}</span>
					)}
					<div class={styles.overlay}>
						<img src={artwork} />
					</div>

				</Card.Media>
				<div class={`${styles.padding} ${styles.flex}`}>
					<div>
						<span>
							<Icon>headset</Icon> {approximateNumber(track.plays, { capital: true, round: true })}
						</span>
						<span>
							<LikeIndicator
								track={track}
								className={styles.likeIndicator}
								iconLast={false}
							/>
						</span>
						{settings.beta === SETTINGS.ENABLE_BETA && (
							<TrackCollectionIndicator
								track={track}
								inCollection={inCollection}
								onSaveTrackToCollection={this.saveTrackToCollection.bind(this)}
								onRemoveTrackFromCollection={this.removeTrackFromCollection.bind(this)}
							/>
						)}
					</div>
					<div>
						<span style={{ margin: 0 }}>
							<Icon>access_time</Icon> {seconds_to_time(track.duration).rendered}
						</span>
					</div>
				</div>
			</Card>
		);
	}
}
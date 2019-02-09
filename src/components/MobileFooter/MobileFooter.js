import { Component } from "preact";
import Icon from 'preact-material-components/Icon';
import Tabs from "preact-material-components/Tabs";
import Button from 'preact-material-components/Button';
import "preact-material-components/Tabs/style.css";
import 'preact-material-components/Button/style.css';
import styles from './style';
import { route, getCurrentUrl } from "preact-router";
import { connect } from "preact-redux";
import { SEARCH } from "../../enums/search";
import { seconds_to_time } from "../../utils/seconds-to-time";
import { playing_now } from '../../actions/track';
import Goku from '../../assets/goku.png';
import { LikeIndicator } from "../LikeIndicator";
import { TrackCollectionIndicator } from "../TrackCollectionIndicator";

@connect(({ auth, currently_playing, user }) => ({ auth, currently_playing, user }))
export class MobileFooter extends Component {
	state = { activeTabIndex: 0 };

	tracks = {};

	constructor (opts) {
		super(opts);
		this.audioPlayer = opts.audioPlayer;
	}

	goHome = (e) => {
		route('/');
		e.preventDefault();
		e.target.blur();
	};

	goToMusic = (e) => {
		route('/collection/tracks');
		e.preventDefault();
		e.target.blur();
	};

	goToLogin = e => {
		route('/login');
		e.preventDefault();
		e.target.blur();
	};

	onClickSearch = () => {
		this.props.dispatch({ type: SEARCH.SHOW_SEARCH_PANEL });
	};

	componentDidMount () {
		let activeTabIndex = 0;
		let { audioPlayer } = this.props;
		if (audioPlayer == null && window.document.querySelector('audio') != null) {
			audioPlayer = window.document.querySelector('audio');
		}
		if (getCurrentUrl() === '/search') activeTabIndex = 1;
		if (getCurrentUrl() === '/collection/tracks' && this.props.auth.logged_in) activeTabIndex = 2;
		if (getCurrentUrl() === '/login' && !this.props.auth.logged_in) activeTabIndex = 2;

		this.setState({ activeTabIndex });

		window.document.addEventListener('url-change', () => {
			let activeTabIndex = 0;
			if (getCurrentUrl() === '/search') activeTabIndex = 1;
			if (getCurrentUrl() === '/collection/tracks' && this.props.auth.logged_in) activeTabIndex = 2;
			if (getCurrentUrl() === '/login' && !this.props.auth.logged_in) activeTabIndex = 2;

			this.setState({ activeTabIndex });

			this._hidePlayer();
		});
	}

	componentDidUpdate () {
		const { currently_playing } = this.props;
		let { audioPlayer } = this;

		if (currently_playing.playing === true) {
			if (currently_playing.position != null && currently_playing.position < this.tracks[currently_playing.track.id]) {
				this.tracks[currently_playing.track.id] = currently_playing.position;
			}

			requestAnimationFrame(_ => {
				const updatedTime = this.tracks[currently_playing.track.id] || currently_playing.position || 0;
				const url = currently_playing.track.stream_url;
				const currentTime = parseInt(audioPlayer.currentTime)
				const _updated = parseInt(updatedTime);

				if (audioPlayer.src !== url) {
					return audioPlayer.play(url);
				}

				if (
					(
						currentTime !== _updated &&
						currentTime + 1 > updated
					) ||
					audioPlayer.paused === true) {
					audioPlayer.play(url, updatedTime);
				}
			});
		} else {
			if (currently_playing.track) {
				this.tracks[currently_playing.track.id] = audioPlayer.currentTime;
				audioPlayer.pause();
			}
		}
	}

	componentWillUpdate (nextProps) {
		let { audioPlayer } = this;
		const currently_playing = nextProps.currently_playing || this.props.currently_playing;

		if (currently_playing.track && audioPlayer.currentTime > this.tracks[currently_playing.track.id]) {
			this.tracks[currently_playing.track.id] = audioPlayer.currentTime;
		} else {
			if (currently_playing.track) {
				this.tracks[currently_playing.track.id] = currently_playing.position;
			}
		}

		if (currently_playing.position > audioPlayer.currentTime) {
			this.tracks[currently_playing.track.id] = currently_playing.position;
		}
	}

	showPlayer = e => {
		if (e.target.tagName === "BUTTON") return;
		e.stopPropagation();
		this.footer.classList.add(styles.player);
	}

	_hidePlayer = () => {
		const playerCss = styles.player;
		requestAnimationFrame(() => this.footer.classList.remove(playerCss));
	}

	hidePlayer = e => {
		if (e.target.tagName === "BUTTON") return;
		e.stopPropagation();
		this._hidePlayer();
	}

	getArtwork (track) {
		const userAvatar = track && track.user && track.user.profilePicture;
		const trackArtwork = track && track.artwork;
		return trackArtwork || userAvatar || Goku;
	}

	getProfilePicture (profile) {
		return profile.profilePicture || Goku;
	}

	goToProfile = e => {
		const { currently_playing } = this.props;
		e.preventDefault();
		this._hidePlayer();
		route(`/${currently_playing.owner.profile.url}`);
	}

	goToTrack = e => {
		const { currently_playing } = this.props;
		e.preventDefault();
		this._hidePlayer();
		route(`/${currently_playing.owner.profile.url}/${currently_playing.track.url}`);
	}

	onPosChange = () => {
		const pos = this.audioPlayer.currentTime;
		const duration = this.audioPlayer.duration;
		this.__currentPos = pos;
		this.__currentTime = seconds_to_time(pos).rendered;
		this.progressBar.setAttribute('style', `transform: translateX(${pos / duration * 100}%)`);
		this.thumb.setAttribute('style', `transform: translateX(${pos / duration * this.thumb.parentElement.clientWidth}px)`);
		this.amount_el.textContent = this.__currentTime;
		this.tracks[this.props.currently_playing.track.id] = pos;
	}

	onMouseMove = e => {
		if (this.desktopTrackbar === null) return;
		const { currently_playing, dispatch } = this.props;
		const touch = e.targetTouches[0];
		const duration = (currently_playing.track && currently_playing.track.duration) || 0;
		const trackbarWidth = this.desktopTrackbar.clientWidth;
		const positionInPage = parseInt(touch.screenX);
		const rect = this.desktopTrackbar.getBoundingClientRect();
		const offset = rect.left;
		const percentage = (positionInPage - offset) / trackbarWidth;
		const time = duration * percentage;
		const owner = { profile: currently_playing.user || currently_playing.owner };

		playing_now(dispatch, { playing: true, position: time, track: currently_playing.track, owner });
	}

	onMouseOut = this.onMouseUp;

	onMouseDown = e => {
		const { currently_playing, dispatch } = this.props;
		const duration = (currently_playing.track && currently_playing.track.duration) || 0;
		const touch = e.targetTouches[0];
		const trackbarWidth = this.desktopTrackbar.clientWidth;
		const positionInPage = parseInt(touch.screenX);
		const rect = this.desktopTrackbar.getBoundingClientRect();
		const offset = rect.left;
		const percentage = (positionInPage - offset) / trackbarWidth;
		const owner = { profile: currently_playing.user || currently_playing.owner };

		playing_now(dispatch, {
			playing: true,
			position: duration * percentage,
			track: currently_playing.track,
			owner
		});
	}

	render ({
		trackName,
		owner,
		playing,
		onClickPlay,
		onClickPause,
		auth,
		currently_playing,
		audioPlayer,
		calculate_amount,
		onClickPrevious,
		onClickNext,
		repeat,
		shuffle,
		repeatEnabled,
		shuffleEnabled
	}, { activeTabIndex }) {
		let position = 0;
		let amount = 0;
		let duration = 0;
		let parentWidth = 1;

		if (currently_playing != null && currently_playing.track != null) {
			amount = calculate_amount(currently_playing);
			duration = parseInt(currently_playing.track.duration);
			this.__currentTime = duration;
			position = this.tracks[currently_playing.track.id] || currently_playing.position;
		}

		if (this.thumb != null) {
			parentWidth = this.thumb.parentElement.clientWidth;
		}

		return (
			<div class={styles.mobile}>
				<div class={styles.footer} onClick={this.showPlayer} ref={e => (this.footer = e)}>
					<div class={styles.breaker}></div>
					<div class={styles.start}>
						<div class={styles.songInfo}>
							<p>
								<span>{owner}</span>
								<span>{trackName}</span>
							</p>
						</div>
					</div>
					<div class={styles.end}>
						{!playing && (
							<Button ripple className={`${styles.button}`} onClick={onClickPlay}>
								<Icon style={{ margin: 0 }} >play_arrow</Icon>
							</Button>
						)}

						{playing && (
							<Button ripple className={`${styles.button}`} onClick={onClickPause}>
								<Icon style={{ margin: 0 }} >pause</Icon>
							</Button>
						)}
					</div>

					<div class={styles.content}>
						<div class={styles.top} onClick={this.hidePlayer}>
							<p>
								<Icon>keyboard_arrow_down</Icon>
								Now playing <br />
								<span>{trackName}</span>
							</p>
						</div>
						<div class={styles.flex}>
							<div class={styles.imageContainer}>
								<img class={styles.artwork} src={this.getArtwork(currently_playing.track || {})} />
							</div>
							<div class={styles.artistSong}>
								<a
									href={`/${currently_playing.track ? currently_playing.track.owner.url : ''}`}
									class={styles.artist}
									onClick={this.goToProfile}
								>
									{owner}
								</a>
								<a
									href={`/${currently_playing.track ? currently_playing.track.owner.url : ''}${currently_playing.track ? `/${currently_playing.track.url}` : '' }`}
									class={styles.song}
									onClick={this.goToTrack}
								>
									{trackName}
								</a>
							</div>

							<div class={styles.trackbarContainer}>
								<div class={styles.trackBar}
									onTouchStart={this.onMouseDown}
									onTouchMove={this.onMouseMove}
									onTouchEnd={this.onMouseUp}
									ref={e => (this.desktopTrackbar = e)}
								>
									<div class={styles.progress} style={{
										'transform': `translateX(${amount}%)`
									}} ref={e => (this.progressBar = e)}></div>
									<div class={styles.thumb} style={{
										'transform': `translateX(${this.__currentPos / this.duration* parentWidth}px)`
									}} ref={e => (this.thumb = e)}></div>
								</div>
							</div>
							<div>
								<p class={styles.time}>
									<span ref={e => (this.amount_el = e)}>
										{position != null && seconds_to_time(position).rendered}
									</span>
									<span>
										{this.__currentTime != null && seconds_to_time(this.__currentTime).rendered}
									</span>
								</p>
							</div>

							<div class={styles.controls}>
								<Button ripple className={`${styles.button}`} onClick={onClickPrevious}>
									<Icon style={{ margin: 0 }}>skip_previous</Icon>
								</Button>
								{!playing && (
									<Button ripple className={`${styles.button} ${styles.playPause}`} onClick={onClickPlay}>
										<Icon style={{ margin: 0 }} >play_arrow</Icon>
									</Button>
								)}

								{playing && (
									<Button ripple className={`${styles.button} ${styles.playPause}`} onClick={onClickPause}>
										<Icon style={{ margin: 0 }} >pause</Icon>
									</Button>
								)}

								<Button ripple className={`${styles.button}`} onClick={onClickNext}>
									<Icon style={{ margin: 0 }}>skip_next</Icon>
								</Button>
							</div>

							<div class={`${styles.controls} ${styles.marginTop}`}>
								<LikeIndicator track={currently_playing.track || {}} />
								<Button ripple className={`${styles.button} ${repeatEnabled === true && styles.active}`} onClick={repeat}>
									<Icon style={{ margin: 0 }}>repeat</Icon>
								</Button>
								<Button ripple className={`${styles.button} ${shuffleEnabled === true && styles.active}`} onClick={shuffle}>
									<Icon style={{ margin: 0 }}>shuffle</Icon>
								</Button>
								<TrackCollectionIndicator track={currently_playing.track || {}} />
							</div>
						</div>
					</div>
				</div>
				<Tabs className={`${styles.tabs} footer-tabs`} activeTabIndex={activeTabIndex}>
					<Tabs.Tab onClick={this.goHome} active={activeTabIndex === 0}>
						<Icon>home</Icon>
						Home
					</Tabs.Tab>
					{auth.logged_in && (
						<Tabs.Tab active={activeTabIndex === 3} onClick={this.goToMusic}>
							<Icon>import_contacts</Icon>
							Browse
						</Tabs.Tab>
					)}
					<Tabs.Tab active={activeTabIndex === 1} onClick={this.onClickSearch}>
						<Icon>search</Icon>
						Search
					</Tabs.Tab>
					{auth.logged_in ? (
						<Tabs.Tab active={activeTabIndex === 2} onClick={this.goToMusic}>
							<Icon>music_note</Icon>
							My Music
						</Tabs.Tab>
					) : (
						<Tabs.Tab active={activeTabIndex === 2} onClick={this.goToLogin}>
							<Icon>vpn_key</Icon>
							Login
						</Tabs.Tab>
					)}
					{auth.logged_in && (
						<Tabs.Tab active={activeTabIndex === 3} onClick={this.goToMusic}>
							<Icon>favorite</Icon>
							Favorites
						</Tabs.Tab>
					)}
				</Tabs>
			</div>
		);
	}
}
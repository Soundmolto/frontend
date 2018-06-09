import { Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import Dialog from 'preact-material-components/Dialog';
import Snackbar from 'preact-material-components/Snackbar';
import { Waveform } from '../Waveform';
import { EditTrack } from '../EditTrack';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Snackbar/style.css';
import styles from './style';
import { playing_now, delete_track } from '../../actions/track';
import { connect } from 'preact-redux';
import { seconds_to_time } from '../../utils/seconds-to-time';
import dayjs from 'dayjs';
import TimeAgo from 'timeago-react';
import Goku from '../../assets/goku.png';

const new_line_br = (text = '') => text.replace('\n', '<br />');
let className = (e) => (e);

@connect(({ auth, currently_playing }) => ({ auth, currently_playing }))
export class TrackCard extends Component {

	plays = 0;
	played = false;
	deleting = false;

	state = { playing: false };

	editTrackRef = dialog => (this.editTrackPanel = dialog);

	componentDidMount () {
		this.plays = this.props.track.plays;
	}

	componentWillUnmount () {
		this.setState({ playing: false });
		this.plays = 0;
		this.played = false;
	}

	onClickPlayPause (e) {
		this.setState({ playing: !this.state.playing });
		this.props.onStartPlay(this.props.track);
		this.played = true;
		playing_now(this.props.dispatch, {
			playing: this.state.playing,
			track: this.props.track,
			owner: this.props.user
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

	onClickEditTrack (e) {
		this.editTrackPanel.MDComponent.show();
	}

	onClickDeleteTrack (e) {
		this.deleting = true;
		this.bar.MDComponent.show({
			message: "Deleting track",
			actionText: "Undo",
			actionHandler: e => {
				if (e != null) {
					e.preventDefault();
					e.stopImmediatePropagation();
				}
				this.deleting = false;
			}
		});

		window.setTimeout(_ => {
			if (this.deleting) {
				delete_track(this.props.dispatch, {
					track: this.props.track,
					token: this.props.auth.token,
					id: this.props.track.id
				})
			}
		}, 2750);
	}

	render ({ track, user, currentUser, currently_playing, isCurrentTrack }, { pos }) {
		const postedAt = dayjs(parseInt(track.createdAt));
		let posted = postedAt.format('DD-MM-YYYY');
		if (posted.indexOf("NaN") !== -1) posted = "Unavaliable - Parsing error";
		if (this.played === false ) this.plays = track.plays;
		if (this.state.playing === false && currently_playing.track != null && track.id === currently_playing.track.id && currently_playing.playing === true) {
			this.setState({ playing: true });
		}

		if (this.state.playing && track.id !== currently_playing.track.id) {
			this.setState({ playing: false });
		}

		if (currently_playing.playing === false && this.state.playing && track.id === currently_playing.track.id) {
			this.setState({ playing: false });
		}

		return (
			<div class={styles.card}>
				<Card class={styles.cardRoot}>
					<div class={styles.image} style={{ 'background-image': `url(${Goku})` }}>
						<Button class={styles['play-button']} onClick={this.onClickPlayPause.bind(this)}>
							<Icon>
								{!this.state.playing && 'play_arrow'}
								{this.state.playing && 'pause'}
							</Icon>
						</Button>
					</div>
					{isCurrentTrack === true && (
						<h4 class={className(styles.displayName)}>
							<a class={styles.link} href={`/${user.profile.url}`}>
								{user.profile.displayName || user.profile.url || "N/A"}
							</a>
						</h4>
					)}
					{isCurrentTrack == false && (
						<h4 class={className(styles.displayName)}>{user.profile.displayName || user.profile.url || "N/A"}</h4>
					)}
					<TimeAgo
						datetime={postedAt.toDate()} 
						locale='en_AU'
						className={styles.date}
						title={`${posted}`}
					/>
					<h2 class={className(`mdc-typography--title ${styles.username}`)}>
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
					<div>
						<p class={styles.centered}>
							<Icon>headset</Icon> {this.plays}
						</p>
						<span style={{ 'font-size': '0.9rem', float: 'right' }}>
							<p class={`${styles.centered} prel ${styles.w100}`} >
								<span>
									{seconds_to_time(track.duration).rendered}
								</span>
							</p>
						</span>
						{user.profile.id === currentUser.profile.id && (
							<span>
								<p class={className(`${styles.centered} ${styles.actionable}`)} style={{ 'float': 'right' }} onClick={this.onClickDeleteTrack.bind(this)}>
									<Icon style={{ margin: 0 }}>delete</Icon>
								</p>
								<p class={className(`${styles.centered} ${styles.actionable}`)} style={{ 'float': 'right' }} onClick={this.onClickEditTrack.bind(this)}>
									<Icon style={{ margin: 0 }}>edit</Icon>
								</p>
							</span>
						)}
					</div>
				</Card>

				<Dialog ref={this.editTrackRef}>
					<Dialog.Header>Edit Track</Dialog.Header>
					<Dialog.Body>
						<EditTrack track={track} />
					</Dialog.Body>
				</Dialog>
				<Snackbar ref={bar=>{this.bar=bar;}}/>
			</div>
		);
	}
}
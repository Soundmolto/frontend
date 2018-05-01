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
import { delete_track } from '../../actions/track';
import { connect } from 'preact-redux';
import { seconds_to_time } from '../../utils/seconds-to-time';

const new_line_br = (text = '') => text.replace('\n', '<br />');
let className = (e) => (e);

@connect(({ auth }) => ({ auth }))
export class TrackCard extends Component {

	plays = 0;
	played = false;
	deleting = false;

	editTrackRef = dialog => (this.editTrackPanel = dialog);

	componentDidMount () {
		this.plays = this.props.track.plays;
	}

	componentWillUnmount () {
		this.setState({ playing: false });
		this.plays = 0;
		this.played = false;
	}

	state = { playing: false };

	onFinish () {
		this.setState({ playing: false });
	}

	onClickPlayPause (e) {
		this.setState({ playing: !this.state.playing });
		this.waveform.handleTogglePlay();
	}

	onTogglePlay (playing, pos) {
		this.setState({ playing, pos });
	}

	onPause (pos) {
		this.setState({ playing: false, pos })
	}

	onStartPlay () {
		if (this.played === false) {
			this.plays++;
			this.setState({ playing: true });
			this.played = true;
		}
	}

	onClickEditTrack (e) {
		this.editTrackPanel.MDComponent.show();
	}

	onClickDeleteTrack (e) {
		this.deleting = true;
		this.bar.MDComponent.show({
			message: "Deleting track",
			actionText: "Undo",
			actionHandler: e => (this.deleting = false)
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

	render ({ track, user, currentUser }, { pos }) {
		if (this.played === false ) this.plays = track.plays;

		return (
			<div class={styles.card}>
				<Card class={styles.cardRoot}>
					<div style={{ position: "relative" }}>
						<h4 class={className(styles.displayName)}>{user.profile.displayName}</h4>
						<h2 class={className(`mdc-typography--title ${styles.username}`)}>
							<Button style={{ margin: '0 10px 0 0' }} onClick={this.onClickPlayPause.bind(this)}>
								<Icon>
									{!this.state.playing && 'play_arrow'}
									{this.state.playing && 'pause'}
								</Icon>
							</Button>
							{track.name}
							{user.profile.id === currentUser.profile.id && (
								<p class={className(`${styles.centered} ${styles.actionable}`)} style={{ 'position': 'absolute', 'top': 0, 'right': 0 }} onClick={this.onClickDeleteTrack.bind(this)}>
									<Icon style={{ margin: 0 }}>delete</Icon>
								</p>
							)}
						</h2>
						<Waveform
							ref={e => (this.waveform = e)}
							data={track}
							onFinish={this.onFinish.bind(this)}
							onTogglePlay={this.onTogglePlay.bind(this)}
							onPause={this.onPause.bind(this)}
							onStartPlay={this.onStartPlay.bind(this)}
							key={track.id}
							onPosChange={pos => this.setState({ pos })}
						/>
						<div style={{ 'font-size': '0.9rem' }}>
							<p class={`${styles.centered} prel ${styles.w100}`} >
								<span>
									{seconds_to_time(track.duration).rendered}
								</span>
							</p>
						</div>
						<div>
							<p class={styles.centered}>
								<Icon>headset</Icon> {this.plays}
							</p>
							{user.profile.id === currentUser.profile.id && (
								<p class={className(`${styles.centered} ${styles.actionable}`)} style={{ 'float': 'right' }} onClick={this.onClickEditTrack.bind(this)}>
									<Icon style={{ margin: 0 }}>edit</Icon>
								</p>
							)}
						</div>
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
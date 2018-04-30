import { Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import Dialog from 'preact-material-components/Dialog';
import { Waveform } from '../Waveform';
import { EditTrack } from '../EditTrack';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Dialog/style.css';
import styles from './style';

const new_line_br = (text = '') => text.replace('\n', '<br />');
let className = (e) => (e);

export class TrackCard extends Component {

	plays = 0;
	played = false;

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

	onTogglePlay (playing) {
		this.setState({ playing });
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
		console.log(this.props.track);
	}

	render ({ track, user, currentUser }) {
		if (this.played === false ) this.plays = track.plays;

		return (
			<div class={styles.card}>
				<Card>
					<div>
						<h4 class={className(styles.displayName)}>{user.profile.displayName}</h4>
						<h2 class={className(`mdc-typography--title ${styles.username}`)}>
							<Button style={{ margin: '0 10px 0 0' }} onClick={this.onClickPlayPause.bind(this)}>
								<Icon>
									{!this.state.playing && 'play_arrow'}
									{this.state.playing && 'pause'}
								</Icon>
							</Button>
							{track.name}
						</h2>
						<Waveform
							ref={e => (this.waveform = e)}
							data={track}
							onFinish={this.onFinish.bind(this)}
							onTogglePlay={this.onTogglePlay.bind(this)}
							onStartPlay={this.onStartPlay.bind(this)}
							key={track.id}
						/>
						<div>
							<p class={styles.centered}>
								<Icon>headset</Icon> {this.plays}
							</p>
							{user.profile.id === currentUser.profile.id && (
								<p class={className(`${styles.centered} ${styles.actionable}`)} style={{ 'float': 'right' }} onClick={this.onClickEditTrack.bind(this)}>
									<Icon>edit</Icon> Edit track
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
			</div>
		);
	}
}
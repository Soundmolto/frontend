import { Component } from "preact";
import Button from "preact-material-components/Button";
import Card from 'preact-material-components/Card';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import styles from './style.css';
import Goku from '../../assets/goku.png';
import { route } from "preact-router";
import { seconds_to_time } from "../../utils/seconds-to-time";
import { playing_now } from "../../actions/track";
import { connect } from 'preact-redux';

@connect( ({ auth, currently_playing }) => ({ auth, currently_playing }))
export class DiscoverCard extends Component {

	state = { playing: false };

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

	render ({ currently_playing, track, user }, { playing }) {
		const artwork = track.artwork || user.profilePicture || Goku;

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
			<Card style={{ overflow: 'hidden' }}>
				<div class={`${styles.paddingAll} ${styles.flexible}`}>
					<Button onClick={this.onStartPlay.bind(this)}>
						{playing === false && (<Icon>play_arrow</Icon>)}
						{playing === true && (<Icon>pause</Icon>)}
					</Button>
					<div style={{ display: 'block', width: '100%', position: 'relative' }}>
						<h2 class={`mdc-typography--title ${styles.noOverflow}`}>
							<a href={`/${user.url}`}>
								{user.displayName || "Untitled user"}
							</a>
						</h2>
						<div class={`mdc-typography--caption ${styles.noOverflow}`}>
							<a href={`/${user.url}/${track.url}`}>
								{track.name}
							</a>
						</div>
						{track.genres && track.genres.length !== 0 && (
							<span class={styles.genre}>{track.genres[0]}</span>
						)}
					</div>
				</div>
				<Card.Media className="card-media" style={{ height: '150px', overflow: 'hidden' }}>
					<div class={styles.blur} style={{ 'background-image': `url(${artwork})` }}></div>
					<div class={styles.overlay}>
						<img src={artwork} />
					</div>

				</Card.Media>
				<div class={`${styles.padding} ${styles.flex}`}>
					<div>
						<span>
							<Icon>headset</Icon> {track.plays}
						</span>
						<span>
							<Icon>favorite</Icon> {track.amountOfLikes}
						</span>
					</div>
					<div>
						<span style={{ margin: 0 }}>
							<Icon>access_time</Icon> {seconds_to_time(track.duration).rendered}
						</span>
					</div>
				</div>
			</Card>
			// <a href={`${user.url}/${track.url}`} onClick={e => this.goTo(e, `${user.url}/${track.url}`)}>
			// </a>
		);
	}
}
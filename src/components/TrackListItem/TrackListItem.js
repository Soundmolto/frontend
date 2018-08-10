import { Component } from "preact";
import List from 'preact-material-components/List';
import Icon from 'preact-material-components/Icon';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/List/style.css';
import 'preact-material-components/LayoutGrid/style.css';
import { seconds_to_time } from "../../utils/seconds-to-time";
import { playing_now } from "../../actions/track";
import { connect } from 'preact-redux';
import styles from './style.css';

@connect( ({ auth, currently_playing }) => ({ auth, currently_playing }))
export class TrackListItem extends Component {

	state = { playing: false };

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
			<List.Item class={styles['list-item']}>
				<List.ItemGraphic class={styles.hover}>
					<Icon onClick={this.onStartPlay.bind(this)}>
						{(playing) ? 'pause' : 'play_arrow' }
					</Icon>
				</List.ItemGraphic>
				<List.TextContainer class={styles.container}>
					<LayoutGrid class={styles.grid}>
						<LayoutGrid.Inner class={styles['grid-inner']}>
							<LayoutGrid.Cell desktopCols="6" tabletCols="6" phoneCols="6">
								<List.PrimaryText>
									<a href={`/${track.user.url}/${track.url}`}>
										{track.name}
									</a>
								</List.PrimaryText>
								<List.SecondaryText>
									<a href={`/${track.user.url}`}>
										{track.user.displayName}
									</a>
								</List.SecondaryText>
							</LayoutGrid.Cell>
							<LayoutGrid.Cell desktopCols="6" tabletCols="6" phoneCols="6">
								<List.SecondaryText>
									<p class={styles.time}>
										{seconds_to_time(track.duration).rendered}
									</p>
								</List.SecondaryText>
							</LayoutGrid.Cell>
						</LayoutGrid.Inner>
					</LayoutGrid>
				</List.TextContainer>
				<List.ItemMeta>
					<Icon onClick={e => this.delete_user(user)}>delete</Icon>
				</List.ItemMeta>
			</List.Item>
		);
	}
}
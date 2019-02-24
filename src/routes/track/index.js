import { h, Component } from 'preact';
import Goku from '../../assets/goku.png';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/LayoutGrid/style.css';
import 'preact-material-components/Button/style.css';
import { connect } from 'preact-redux';
import { get_track, delete_track } from '../../actions/track';
import style from './style';
import { getCurrentUrl } from 'preact-router';
import { TrackCard } from '../../components/TrackCard';
import Helmet from 'preact-helmet';
import { APP } from '../../enums/app';
import snarkdown from 'snarkdown';
import { generateTwitterCard } from '../../utils/generateTwitterCard';
import { EditTrack } from '../../components/EditTrack';
import Dialog from 'preact-material-components/Dialog';
import Snackbar from 'preact-material-components/Snackbar';
import { finish_editing_track } from '../../actions/editingTrack';
import { Comments } from '../../components/Comments/Comments';
import { CommentForm } from '../../components/CommentForm/CommentForm';
import { submit_comment, delete_comment } from '../../actions/comment';

@connect(state => state)
export default class Track extends Component {

	tracks = [];

	currentUrl = getCurrentUrl();
	editTrackRef = dialog => (this.editTrackPanel = dialog);

	componentDidMount () {
		this.updateData();
	}

	componentDidUpdate () {
		window.requestAnimationFrame(() => {
			if (this.props.editingTrack.editing && this.editTrackPanel) {
				this.editTrackPanel.MDComponent.show()
			}
		})
	}

	onCloseEditTrack = () => {
		finish_editing_track(this.props.dispatch);
	};

	updateData () {
		const { auth, dispatch, track_url, vanity_url } = this.props;
		let secret = null;
		if (this.currentUrl.split('?secret=').length === 2) secret = this.currentUrl.split('?secret=')[1];
		get_track(dispatch.bind(this), { token: auth.token, track_url, vanity_url, secret });
		this.currentUrl = getCurrentUrl();
	}

	/**
	 * When the user starts playing a track.
	 * 
	 * @param {Object} track - Currently playing track
	 */
	onStartPlay (track) {
		const { queue } = this.props;
		const tracks = [this.tracks[0]].concat(this.tracks.filter(track => this.tracks[0].id !== track.id));
		let i = 0;

		for (const index in tracks) {
			if (tracks[index].id === track.id) {
				i = index;
			}
		}

		if (queue.tracks.filter(_track => _track.id !== track.id).length === 0) {
			queue.title = `${track.name}'s recommendations`
			queue.tracks = [].concat(tracks);
			queue.position = 0;
		} else {
			queue.position = i;
		}

	}

	getArtwork (track, user) {
		const userAvatar = user && user.profilePicture;
		const trackArtwork = track && track.artwork;
		return trackArtwork || userAvatar || Goku;
	}

	onDelete = () => {
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
				const { track } = this.props.track;
				delete_track(this.props.dispatch, {
					track: track,
					token: this.props.auth.token,
					id: track.id
				})
			}
		}, 5500);
	};

	closeEditTrackPanel = () => {
		this.editTrackPanel.MDComponent.close();
	}

	submitComment = (comment, done) => {
		const track = this.props.track.track || {};
		submit_comment(this.props.dispatch, { id: track.id, token: this.props.auth.token, comment }, done);
	};

	deleteComment = (comment) => {
		delete_comment(this.props.dispatch, { id: comment.id, token: this.props.auth.token, track: this.props.track.track });
	};

	render ({ user, viewedUser, track, editingTrack }) {
		const viewedTrack = track.track || {};
		if (this.currentUrl !== getCurrentUrl()) this.updateData();

		for (const track of viewedUser.tracks) {
			track.user = viewedUser.profile;
		}

		const tracks = viewedUser.tracks.sort((first, second) => parseInt(second.createdAt) - parseInt(first.createdAt));
		this.tracks = [track.track].concat(tracks);

		if (viewedTrack.comments) {
			viewedTrack.comments = viewedTrack.comments.sort((first, second) => parseInt(second.createdAt) - parseInt(first.createdAt));
		} else {
			viewedTrack.comments = [];
		}

		return (
			<div class={style.profile}>
				<Helmet
					title={`${APP.NAME} - ${(viewedTrack && viewedTrack.name) || "Loading..."}`}
					meta={generateTwitterCard({
						summary: `Listen to ${(viewedTrack && viewedTrack.name)} on SoundMolto`,
						site: `${APP.TWITTER_HANDLE}`,
						title: `${APP.NAME} - ${(viewedTrack && viewedTrack.name) || "Loading..."}`,
						description: track.description,
						image: this.getArtwork(viewedTrack, viewedUser.profile) || `https://app.soundmolto.com/assets/icons/android-chrome-512x512.png`,
					})}
				/>
				<div class={"header " + style.header}>
					<div class={style.background} style={{ 'background-image': `url(${this.getArtwork(viewedTrack, viewedUser.profile)})` }}></div>
					<div class={style.overlay}>
						<h1>
							{viewedTrack != null && viewedTrack.id != null && viewedTrack.owner != null && (
								viewedTrack.name
							)}
						</h1>
					</div>
					<div class={style.fade}></div>
				</div>
				<LayoutGrid>
					{viewedTrack != null && viewedTrack.id != null && viewedTrack.owner != null && (
						<LayoutGrid.Inner>
							<LayoutGrid.Cell desktopCols="12" tabletCols="12" tabletOrder="1">
								<div class={style.profile_contents}>
									<TrackCard
										track={viewedTrack}
										user={viewedUser}
										currentUser={user}
										key={viewedTrack.id}
										audioContext={this.props.audioContext}
										isCurrentTrack={true}
										onStartPlay={this.onStartPlay.bind(this)}
										onDelete={this.onDelete}
										onShareTrack={this.props.onShareTrack}
									/>
								</div>
							</LayoutGrid.Cell>
							<LayoutGrid.Cell desktopCols="12" tabletCols="12" tabletOrder="1">
								<div class={style.profile_contents}>
									<h1 class={style.mainHeader} style={{ margin: '0 0 10px 0' }}>
										Description
									</h1>
									<div
										class="mdc-custom-card"
										dangerouslySetInnerHTML={{
											__html: snarkdown(
												viewedTrack.description || 'Track has no description.'
											)
										}}
									>
									</div>
								</div>
							</LayoutGrid.Cell>

							<LayoutGrid.Cell desktopCols="12" tabletCols="12" tabletOrder="1">
								<CommentForm submitComment={this.submitComment} />
							</LayoutGrid.Cell>

							<LayoutGrid.Cell desktopCols="12" tabletCols="12" tabletOrder="1">
								<Comments
									comments={viewedTrack.comments}
									user={viewedUser}
									profile={viewedUser.profile}
									deleteComment={this.deleteComment}
								/>
							</LayoutGrid.Cell>
						</LayoutGrid.Inner>
					)}

					{(viewedTrack == null || viewedTrack != null && viewedTrack.id == null && viewedTrack.owner == null) && (
						<LayoutGrid.Inner>
							<LayoutGrid.Cell desktopCols="12" tabletCols="12" tabletOrder="1">
								<div class={style.profile_contents}>
									<div>Track not found...</div>
								</div>
							</LayoutGrid.Cell>
						</LayoutGrid.Inner>
					)}
					
				</LayoutGrid>
				{editingTrack.editing && (
					<Dialog ref={this.editTrackRef} onCancel={this.onCloseEditTrack} class="edit-modal">
						<div class="modal-border-top"></div>
						<Dialog.Header>
							Edit Track
							<Icon class={style.modalClose} onClick={this.closeEditTrackPanel}>close</Icon>
						</Dialog.Header>
						<Dialog.Body>
							<EditTrack track={editingTrack.track} onSubmit={newTrack => {
								if (isCurrentTrack === true) {
									route(`/${track.user.url}/${newTrack.url}`, true);
								}
							}} />
						</Dialog.Body>
					</Dialog>
				)}
				<Snackbar ref={bar=>(this.bar=bar)}/>
			</div>
		);
	}
}

import { h, Component } from "preact";
import Button from "preact-material-components/Button";
import Helmet from "preact-helmet";
import Icon from "preact-material-components/Icon";
import "preact-material-components/Button/style.css";
import { connect } from "preact-redux";
import {
	fetch_user,
	follow_user,
	unfollow_user,
	fetch_user_more_songs
} from "../../actions/user";
import { UserDescription } from "../../components/UserDescription";
import { UserPictureName } from "../../components/UserPictureName";
import { UserFollowers } from "../../components/UserFollowers";
import { getCurrentUrl } from "preact-router";
import { UserFollowing } from "../../components/UserFollowing";
import { USER } from "../../enums/user";
import { APP } from "../../enums/app";
import style from "./style";
import { generateTwitterCard } from "../../utils/generateTwitterCard";
import { SETTINGS } from "../../enums/settings";
import { ProfileTabContainer } from "../../components/ProfileTabContainer";
import { TracksContainer } from "../../components/TracksContainer";
import { EditTrack } from "../../components/EditTrack";
import Dialog from "preact-material-components/Dialog";
import Snackbar from "preact-material-components/Snackbar";
import { finish_editing_track } from "../../actions/editingTrack";
import { delete_track } from "../../actions/track";
import Goku from "../../assets/goku.png";
import { prefill_auth } from "../../prefill-authorized-route";
import { API_ENDPOINT } from "../../api";

let _following = false;
let hasMore = false;

@connect(({ auth, user, viewedUser, settings, editingTrack }) => ({
	auth,
	user,
	viewedUser,
	settings,
	editingTrack
}))
export default class Profile extends Component {
	changeCoverPhotoRef = e => (this.changeCoverPhotoModal = e);
	shouldUpdateData = false;

	state = { editingCoverPhoto: false };

	currentUrl = getCurrentUrl();
	deleting = false;

	editTrackRef = dialog => (this.editTrackPanel = dialog);

	componentDidMount() {
		this.updateData();
	}

	loadMore = () => {
		const { dispatch, auth, viewedUser } = this.props;
		fetch_user_more_songs(dispatch, {
			token: auth.token,
			nextUrl: viewedUser.nextUrl
		});
	};

	updateData() {
		const { auth, vanity_url } = this.props;
		fetch_user(this.props.dispatch.bind(this), {
			token: auth.token,
			vanity_url
		});
		this.currentUrl = getCurrentUrl();

		if (this.shouldUpdateData) {
			this.setState({ editingCoverPhoto: false });
		}

		this.shouldUpdateData = false;
	}

	/**
	 * Check whether you are currently following this user.
	 *
	 * @param {Object} user - You / The currently logged in user.
	 */
	following(user) {
		let r = false;
		if (user.followers.length >= 1) {
			for (const follower of user.followers) {
				if (follower.id === this.props.user.profile.id) {
					r = true;
				}
			}
		}

		// Memoize so we don't do this for functions
		_following = r;
		return r;
	}

	/**
	 * Toggle the following status.
	 */
	toggle_following() {
		const { auth, viewedUser } = this.props;
		if (_following) {
			unfollow_user(this.props.dispatch.bind(this), {
				token: auth.token,
				user: viewedUser
			});
		} else {
			follow_user(this.props.dispatch.bind(this), {
				token: auth.token,
				user: viewedUser
			});
		}
	}

	/**
	 * When the user starts playing a track.
	 *
	 * @param {Object} track - Currently playing track
	 */
	onStartPlay(track) {
		const { queue, viewedUser } = this.props;
		const name = viewedUser.profile.displayName || viewedUser.profile.url;
		const tracks = [].concat(this.tracks);
		let i = 0;

		for (const index in tracks) {
			if (tracks[index].id === track.id) {
				i = index;
			}
		}

		queue.title = `${name}'s profile`;
		queue.tracks = [].concat(tracks);
		queue.position = i;
	}

	massageObject({
		followers,
		following,
		id,
		likes,
		profile,
		tracks,
		verified
	}) {
		// Faster than using Object.assign & less code to send to the user.
		return {
			...{ followers, following, id, likes, profile, tracks, verified }
		};
	}

	componentWillUpdate(props, nextState) {
		const state = this.props.store.getState();
		const viewed = this.massageObject(state.viewedUser);
		const user = this.massageObject(state.user);
		const are_same = JSON.stringify(viewed) === JSON.stringify(user);
		const { editingCoverPhoto } = nextState;

		if (editingCoverPhoto === true) return true;
		if (state.viewedUser.shouldForcefullyIgnoreUpdateLogic != null)
			return true;
		if (
			state.user.profile &&
			state.user.profile.url === this.props.vanity_url &&
			false === are_same
		) {
			this.props.dispatch({
				type: USER.VIEW_PROFILE,
				payload: state.user
			});
		}
	}

	componentDidUpdate() {
		window.requestAnimationFrame(() => {
			if (this.props.editingTrack.editing && this.editTrackPanel) {
				this.editTrackPanel.MDComponent.show();
			}

			if (this.state.editingCoverPhoto && this.changeCoverPhotoModal) {
				this.changeCoverPhotoModal.MDComponent.show();
			}
		});
	}

	onCloseEditTrack = () => finish_editing_track(this.props.dispatch);

	closeEditTrackPanel = () => {
		this.editTrackPanel.MDComponent.close();
	};

	onCloseCoverPhotoModal = () => this.setState({ editingCoverPhoto: false });

	onDelete = track => {
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
					track: track,
					token: this.props.auth.token,
					id: track.id
				});
			}
		}, 5500);
	};

	onReportTrack = track => {
		console.log("yeah, about that...", track);
	};

	changeCoverPhoto = () => {
		// Change the cover photo
		this.setState({ editingCoverPhoto: true });
	};

	onChangeCoverPhoto = async (e, f) => {
		const file = f || e.target.files[0];
		const data = new FormData();
		const { token } = this.props.auth;
		data.append("file", file, file.name);
		const user = this.props.user;

		const post = await fetch(
			`${API_ENDPOINT}/users/${this.props.user.id}/cover-photo`,
			{ method: "POST", headers: { ...prefill_auth(token) }, body: data }
		);
		const payload = await post.json();
		user.profile = payload.profile;

		this.shouldUpdateData = true;
		e.target.value = "";
		this.props.dispatch({ type: USER.HAS_NEW_DATA, payload: user });
	};

	render(
		{ auth, user, viewedUser, settings, editingTrack },
		{ editingCoverPhoto }
	) {
		const following = this.following(viewedUser);
		const _user =
			viewedUser.profile.displayName ||
			(viewedUser.profile && viewedUser.profile.url);
		const title = `${APP.NAME} - ${_user}`;
		const tracks = viewedUser.tracks;
		const shouldRenderWaveform =
			settings.waveforms === SETTINGS.ENABLE_WAVEFORMS ||
			settings.waveforms == null;
		const defaultPic =
			viewedUser.profile.coverPhoto ||
			viewedUser.profile.profilePicture ||
			Goku;
		if (this.currentUrl !== getCurrentUrl()) this.updateData();
		if (this.shouldUpdateData) this.updateData();

		for (const track of tracks) {
			if (track.user == null) {
				track.user = viewedUser.profile;
			}
		}

		this.tracks = tracks.concat([]);
		hasMore = viewedUser.hasMore;

		return (
			<div class={style.profile}>
				<Helmet
					title={title}
					meta={generateTwitterCard({
						summary: `View ${_user}'s profile on SoundMolto`,
						site: `${APP.TWITTER_HANDLE}`,
						title: title,
						description: `View ${_user}'s profile on SoundMolto`,
						image:
							viewedUser.profile.profilePicture ||
							`https://app.soundmolto.com/assets/icons/android-chrome-512x512.png`
					})}
				/>
				<div
					class={"header " + style.header}
					style={{
						backgroundImage: `url(${defaultPic})`
					}}
				>
					<UserPictureName
						user={viewedUser.profile}
						show_location={true}
						style={{
							width: "100%",
							position: "relative"
						}}
						role={viewedUser.role}
					>
						{auth.logged_in != null &&
							user.profile.id !== viewedUser.profile.id && (
								<Button
									class={style.button}
									onClick={this.toggle_following.bind(this)}
								>
									{following
										? "Unfollow user"
										: "Follow user"}
								</Button>
							)}
						{auth.logged_in != null &&
							user.profile.id === viewedUser.profile.id && (
								<Button
									class={style.coverPhotoButton}
									onClick={this.changeCoverPhoto}
								>
									Change cover photo
								</Button>
							)}
						<div class={style.fade} />
					</UserPictureName>
				</div>
				<div class={style.profile_contents}>
					<ProfileTabContainer
						amountOfTracks={viewedUser.amountOfTracks}
						tracks={
							<div>
								{tracks.length >= 1 && (
									<TracksContainer
										tracks={tracks}
										shouldRenderWaveform={
											shouldRenderWaveform
										}
										onStartPlay={this.onStartPlay.bind(
											this
										)}
										viewedUser={viewedUser}
										user={user}
										onDelete={track => this.onDelete(track)}
										onReportTrack={this.onReportTrack}
										onShareTrack={this.props.onShareTrack}
										audioPlayer={this.props.audioPlayer}
									/>
								)}
								{tracks.length <= 0 && <h1>No tracks</h1>}
							</div>
						}
						about={
							<div>
								{viewedUser != null && (
									<UserDescription
										user={viewedUser.profile}
									/>
								)}
								{viewedUser != null && (
									<UserFollowers
										viewedUser={viewedUser}
										style={{ "margin-top": "20px" }}
									/>
								)}
								{viewedUser != null && (
									<UserFollowing
										viewedUser={viewedUser}
										style={{ "margin-top": "20px" }}
									/>
								)}
							</div>
						}
					/>
				</div>
				{editingTrack.editing && (
					<Dialog
						ref={this.editTrackRef}
						onCancel={this.onCloseEditTrack}
						class="edit-modal"
					>
						<div class="modal-border-top" />
						<Dialog.Header>
							Edit Track
							<Icon
								class={style.modalClose}
								onClick={this.closeEditTrackPanel}
							>
								close
							</Icon>
						</Dialog.Header>
						<Dialog.Body>
							<EditTrack track={editingTrack.track} />
						</Dialog.Body>
					</Dialog>
				)}
				{editingCoverPhoto && (
					<Dialog
						ref={this.changeCoverPhotoRef}
						onCancel={this.onCloseCoverPhotoModal}
					>
						<div class="modal-border-top" />
						<Dialog.Header>Change cover photo</Dialog.Header>
						<Dialog.Body>
							<ul>
								<li>
									Cover photo <b>must</b> be at least 1920x300
								</li>
							</ul>
							<form>
								<input
									type="file"
									accept="image/*"
									onChange={this.onChangeCoverPhoto}
								/>
							</form>
						</Dialog.Body>
					</Dialog>
				)}
				<Snackbar
					ref={bar => {
						this.bar = bar;
					}}
				/>
			</div>
		);
	}
}

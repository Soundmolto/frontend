import { Component } from "preact";
import { connect } from "preact-redux";
import Dialog from "preact-material-components/Dialog";
import { TextField } from "preact-material-components/TextField";
import 'preact-material-components/TextField/style.css';
import raf from 'raf';
import debounce from 'lodash.debounce';
import { API_ENDPOINT } from "../../api";
import { prefill_auth } from "../../prefill-authorized-route";
import styles from './styles.css';
import { UserPictureName } from "../UserPictureName";
import { SEARCH } from "../../enums/search";
import Goku from '../../assets/goku.png';


@connect(({ search, auth }) => ({ search, auth }))
export class SearchModal extends Component {
	searchModalRef = dialog => this.searchModal = dialog;

	state = {
		loading: false,
		items: { tracks: [], users: [] },
		hasItems: false,
		hoverItem: null,
		hoverType: null
	};

	async searchValue (query) {
		try {
			const data = await fetch(`${API_ENDPOINT}/search`, {
				body: JSON.stringify({ query }),
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					...prefill_auth(this.props.token)
				}
			});

			const { tracks, users } = await data.json();
	
			if (data.status === 200) {
				const hasItems = tracks.length !== 0 || users.length !== 0;
				this.setState({ items: { tracks, users }, hasItems, loading: false });
			} else {
				throw new Error(data.statusText);
			}
	
		} catch (error) {
			console.error(error);
		}
	}
	
	onKeyUp = e => {
		const value = e.target.value;
		if (e.key === 'Escape') return this.close();
		debounce(_ => {
			raf(_ => {
				if (value.trim() !== "") {
					this.setState({ loading: true });
					this.searchValue(value);
				}
			})
		}, 16)();
	}

	close = () => this.props.dispatch({ type: SEARCH.HIDE_SEARCH_PANEL });


	onClickUrl = () => {
		this.close();
	}

	getPicture (track) {
		return track.artwork || track.user.profilePicture || Goku;
	}
	
	onCancel = () => {
		this.close();
	}

	componentDidUpdate = () => {
		if (this.props.search.show) {
			this.searchModal.MDComponent.show();
		} else {
			this.searchModal.MDComponent.close();
		}
	}

	render (props, { loading, items }) {
		const { users, tracks } = items;
		const { auth } = props;
		return (
			<Dialog ref={this.searchModalRef} onCancel={this.onCancel} class={`search-modal`}>
				<div class="modal-border-top"></div>
				<Dialog.Body>
					
					<TextField onKeyUp={this.onKeyUp} />

					<div class={styles.flexTop}>
						<div class={styles.columns}>
							<div class={styles.list}>
								<h3 class={styles.headerTitle}>
									Users {users.length}
								</h3>
								<div class={styles.userContainer}>
									{users.map(user => (
										<UserPictureName
											user={user}
											linksToProfile={true}
											onClickProfile={this.onClickUrl}
											h1_class={styles.h1Class}
											onMouseOver={e => this.setState({ hoverItem: user, hoverType: 'user' })}
											class={styles.userPictureName}
										>
											<p class={styles.followers}>
												{user.followersAmount} {user.followersAmount >= 2 ? 'followers': 'follower'}
											</p>
										</UserPictureName>
									))}
								</div>
							</div>

							<div class={styles.list}>
								<h3 class={styles.headerTitle}>
									Tracks {tracks.length}
								</h3>
								<div class={styles.userContainer}>
									{tracks.map(track =>
										<div class={styles.flex}>
											<a
												class={styles.flex}
												href={`/${track.user.url}/${track.url}`}
												onClick={this.onClickUrl}
												style={{ flexWrap: 'nowrap' }}
											>
												<img src={track.artwork || track.user.profilePicture || Goku} />
												<p class={styles['track-title']}>
													{track.name} <br />
													<small>{track.user.displayName}</small>
												</p>
											</a>
										</div>
									)}
								</div>
							</div>
						</div>
						
						<div class={`${styles.columns} ${styles.hiddenMobile}`}>
							<h3 class={styles.headerTitle}>
								{this.state.hoverItem && this.state.hoverItem.displayName || 'Hover an item to preview it'}
							</h3>
							{this.state.hoverItem != null ? (
								<div class={styles.container}>
									<div
										class={"header " + styles.header}
										style={{
											backgroundImage: `url(${(
												this.state.hoverItem.coverPhoto || this.state.hoverItem.profilePicture || Goku
											)})`
										}}
									>
										<UserPictureName user={this.state.hoverItem} show_location={true} style={{
												width: '100%',
												position: 'relative',

											}} h1_class={styles.username_custom}>
										</UserPictureName>
									</div>

									{auth.logged_in ? (
										<ul>
											<li>
												{this.state.hoverItem.youFollow === true ? 'You follow this user' : 'You do not follow this user'}
											</li>
											<li>
												{this.state.hoverItem.followingYou === true ? 'This user follows you' : 'This user does not follow you'}
											</li>
										</ul>
									) : (<span>No relevant information to show currently.</span>)}
								</div>
							) : ''}
						</div>
					</div>

					{loading && (
						<div>
							<p>Loading results...</p>
						</div>
					)}
				</Dialog.Body>
			</Dialog>
		)
	}
}
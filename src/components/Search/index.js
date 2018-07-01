import { Component } from "preact";
import raf from 'raf';
import debounce from 'lodash.debounce';
import { API_ENDPOINT } from "../../api";
import styles from './style.css';
import { prefill_auth } from "../../prefill-authorized-route";
import Goku from '../../assets/goku.png';

export class Search extends Component {

	state = {
		loading: false,
		items: { tracks: [], users: [] },
		hasItems: false
	};

	shouldClose = true;

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
				// users.sort((first, second) => {
				// 	let initial = 0;
				// 	if (first.following)
				// });
				// console.log(users);
				this.setState({ items: { tracks, users }, hasItems, loading: false });
			} else {
				throw new Error(data.statusText);
			}
	
		} catch (error) {
			console.error(error);
		}
	}
	
	onKeyUp (e) {
		const value = e.target.value;
		if (e.key === 'Escape') return this.close();
		debounce(_ => {
			raf(_ => {
				if (value.trim() !== "") {
					this.setState({ loading: true });
					this.searchValue(value);
				}

				if (value.length === 0) {
					this.close();
				}
			})
		}, 16)();
	}

	close () {
		raf(_ => {
			this.setState({ shouldShow: false });
		});
	}

	open () {
		this.setState({ shouldShow: true });
	}

	onBlur (e) {
		raf(_ => {
			if (this.shouldClose) {
				this.close()
			}
		})
	}

	onFocus () {
		this.open();
	}

	onClickUrl () {
		this.shouldClose = true;
		this.close();
	}

	onBlurLink () {
		if (this.shouldClose === false) {
			this.shouldClose = true;
		}

		this.close();
	}

	getPicture (track) {
		console.log(track);
		return track.artwork || track.user.profilePicture || Goku;
	}

	render (props, { loading, items, hasItems, shouldShow }) {
		return (
			<div class={`search-container ${styles.container}`}>
				<input type="text" className="search-input" onKeyUp={this.onKeyUp.bind(this)} onBlur={this.onBlur.bind(this)}
				onFocus={this.onFocus.bind(this)} placeholder="Search for artists, songs or playlists" />
				{loading && shouldShow && (
					<div class={styles.dropdown}>
						<p>Loading results...</p>
					</div>
				)}
				{hasItems && shouldShow && (
					<div class={styles.dropdown}>
						<h3>Users</h3>
						{items.users.length !== 0 && items.users.map(profile => (
							<a href={`/${profile.url}`} onClick={this.onClickUrl.bind(this)} onFocus={e => (this.shouldClose = false)} onBlur={e => this.onBlurLink.bind(this)}>
								<div class={styles.image} style={{ backgroundImage: `url(${profile.profilePicture})` }} />
								<p>
									{profile.displayName || profile.url}
									{profile.youFollow && (<span class={styles.youFollow}>You follow this user</span>)}
									{profile.followingYou && (<span class={styles.youFollow}>This user follows you</span>)}
								</p>
								<p class={styles.followerDetails}>
									<span>
										Following: {profile.followingAmount}
									</span>
									<span>
										Followers: {profile.followersAmount}
									</span>
								</p>
							</a>
						))}
						{items.users.length === 0 && (<p>No users found</p>)}

						<h3>Tracks</h3>
						{items.tracks.length <= 1 && items.tracks.map(track => (
							<a href={`/${track.user.url}/${track.url}`} onClick={this.onClickUrl.bind(this)} onFocus={e => (this.shouldClose = false)} onBlur={e => this.onBlurLink.bind(this)}>
								<div class={styles.image} style={{ backgroundImage: `url(${this.getPicture(track)})` }} />
								<p>{track.name || track.url || 'wot'}</p>
							</a>
						))}
						{items.tracks.length === 0 && (<p>No tracks found</p>)}
					</div>
				)}
			</div>
		);
	}
}
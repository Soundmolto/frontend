import { USER } from '../enums/user';
import { PLAYLIST } from '../enums/playlist';

export default function reducer (state = {
	id: "",
	verified: "false",
	following: [],
	followers: [],
	profile: {},
	tracks: [],
	playlists: []
  }, action) {
	switch (action.type) {

		case USER.SUCCESSFULLY_LOGGED_IN: {
			let playlists = action.payload.user.playlists || [];
			playlists = playlists.sort((a,b) => parseInt(b.createdAt) - parseInt(a.createdAt));
			action.payload.user.playlists = [].concat(playlists);
			state = Object.assign({}, state, action.payload.user);
			break;
		}

		case USER.MUST_LOGOUT: {
			state = {
				id: "",
				verified: "false",
				following: [],
				followers: [],
				profile: {},
				tracks: []
			};
			break;
		}

		case USER.HAS_NEW_DATA: {
			let playlists = action.payload.playlists;
			playlists = playlists.sort((a,b) => parseInt(b.createdAt) - parseInt(a.createdAt));
			action.payload.playlists = [].concat(playlists);
			state = Object.assign({}, state, action.payload);
			break;
		}
		
		case USER.TOGGLED_LIKE_ON_TRACK: {
			state = {};
		}

		case PLAYLIST.UPDATED_PLAYLIST: {
			const updated = action.payload.playlist;
			let playlists = state.playlists.map(playlist => {
				if (playlist.id === updated.id) {
					return updated;
				}

				return playlist;
			});

			if (playlists.filter(playlist => playlist.id === updated.id).length === 0) {
				playlists.push(updated);
			}

			playlists = playlists.sort((a,b) => parseInt(b.createdAt) - parseInt(a.createdAt));

			state.playlists = [].concat(playlists);
			break;
		}

		case PLAYLIST.CREATED_PLAYLIST: {
			let playlists = [].concat(action.payload.user.playlists)
			playlists.push(action.payload.playlist);
			playlists = playlists.sort((a,b) => parseInt(b.createdAt) - parseInt(a.createdAt));
			state.playlists = [].concat(playlists);
			break;
		}

		case PLAYLIST.DELETED_PLAYLIST: {
			const { playlists } = action.payload;
			state.playlists = [].concat(playlists);
			break;
		}
	}

	return state;
}
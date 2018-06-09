import store from './store';
import { TRACK } from './enums/track';

export const shortcuts = [
	{
		action: e => {
			store.dispatch({
				type: "SHOW_SETTINGS_PANEL"
			})
		},
		keys: 'ctrl+,',
		name: 'show:settings',
		description: 'Open settings panel'
	},
	{
		action: e => {
			if (e != null) {
				e.preventDefault();
				e.stopPropagation();
			}
			store.dispatch({ type: "SHOW_GOTO_PANEL" });
		},
		keys: 'ctrl+g',
		name: 'show:goto',
		description: 'Show "go to" panel'
	},
	{
		action: e => {
			if (e != null) {
				e.preventDefault();
				e.stopPropagation();
			}
			store.dispatch({
				type: "SHOW_SHORTCUTS_PANEL"
			});
		},
		keys: 'ctrl+/',
		name: 'show:shortcuts',
		description: 'Show shortcuts panel'
	},
	{
		action: e => {
			const state = store.getState();
			e.preventDefault();

			if (state.currently_playing.track != null) {
				if (state.currently_playing.playing === true) {
					store.dispatch({
						type: TRACK.PAUSED_TRACK,
						payload: state.currently_playing
					})
				} else {
					store.dispatch({
						type: TRACK.PLAYING_TRACK,
						payload: state.currently_playing
					})
				}
			}
		},
		keys: 'space',
		name: 'toggle:playing',
		description: 'Toggle play/pause of current song'
	},
	{
		action: e => {
			const state = store.getState();
			e.preventDefault();

			if (state.currently_playing.track != null) {
				let track = Object.assign({}, state.currently_playing);
				track.position = track.position + 5;
				if (isNaN(track.position)) track.position = 5;
				
				if (state.currently_playing.playing === true) {
					store.dispatch({
						type: TRACK.PLAYING_TRACK,
						payload: {
							position: track.position, track: track.track, owner: track.owner
						}
					})
				}
			}
		},
		keys: 'right',
		name: 'skip:forward',
		description: 'Skip forward 5 seconds'
	},
	{
		action: e => {
			const state = store.getState();
			e.preventDefault();

			if (state.currently_playing.track != null) {
				let track = Object.assign({}, state.currently_playing);
				track.position = track.position - 5;
				if (isNaN(track.position)) track.position = 0;
				
				if (state.currently_playing.playing === true) {
					store.dispatch({
						type: TRACK.PLAYING_TRACK,
						payload: {
							position: track.position, track: track.track, owner: track.owner
						}
					})
				}
			}
		},
		keys: 'left',
		name: 'skip:backward',
		description: 'Skip backward 5 seconds'
	}
];
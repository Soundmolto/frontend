import store from './store';
import { TRACK } from './enums/track';
import { QueueController } from './components/QueueController';
const queue = new QueueController();

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
					const audio = document.querySelector('audio') || { currentTime: currently_playing.position };
					store.dispatch({
						type: TRACK.PAUSED_TRACK,
						payload: Object.assign({}, state.currently_playing, { position: audio.currentTime })
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
			e.stopImmediatePropagation();

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
	},
	{
		action: e => {
			const state = store.getState();
			const next = queue.next();
			e.preventDefault();
			let owner = {};
			
			if (next != null) {
				if (next.owner === state.currently_playing.owner.id) owner = state.currently_playing.owner;
				store.dispatch({
					type: TRACK.PLAYING_TRACK,
					payload: {
						position: 0, track: next, owner
					}
				})
			}
		},
		keys: 'shift+right',
		name: 'next:track',
		description: 'Skip to next song'
	},
	{
		action: e => {
			const audio = document.querySelector('audio') || { currentTime: 0 };
			const state = store.getState();
			e.preventDefault();
			let owner = {};
			const time = audio.currentTime;

			if (time >= 3) {
				if (currently_playing.track == null) return;
				store.dispatch({
					type: TRACK.PLAYING_TRACK,
					payload: {
						position: 0, track: state.currently_playing.track, owner: state.currently_playing.track.owner
					}
				})
			} else {
				const next = queue.previous();

				if (next.owner === state.currently_playing.owner.id) {
					owner = state.currently_playing.owner;
				}

				store.dispatch({
					type: TRACK.PLAYING_TRACK,
					payload: {
						position: 0, track: next, owner
					}
				})
			}
		},
		keys: 'shift+left',
		name: 'previous:track',
		description: 'Skip to previous song'
	}
];
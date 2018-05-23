import store from './store';

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
];
import { SETTINGS } from '../enums/settings';

export default function reducer (state = { beta: SETTINGS.DISABLE_BETA, waveforms: SETTINGS.ENABLE_WAVEFORMS }, action) {
	switch (action.type) {
		case SETTINGS.ENABLE_BETA: {
			state = { ...state, beta: SETTINGS.ENABLE_BETA };
			break;
		}

		case SETTINGS.DISABLE_BETA: {
			state = { ...state, beta: SETTINGS.DISABLE_BETA };
			break;
		}

		case SETTINGS.ENABLE_WAVEFORMS: {
			state = { ...state, waveforms: SETTINGS.ENABLE_WAVEFORMS };
			break;
		}

		case SETTINGS.DISABLE_WAVEFORMS: {
			state = { ...state, waveforms: SETTINGS.DISABLE_WAVEFORMS };
			break;
		}
	}

	return state;
};
import { SETTINGS } from '../enums/settings';

export default function reducer (state = { beta: SETTINGS.DISABLE_BETA }, action) {
	switch (action.type) {
		case SETTINGS.ENABLE_BETA: {
			state = { beta: SETTINGS.ENABLE_BETA };
			break;
		}

		case SETTINGS.DISABLE_BETA: {
			state = { beta: SETTINGS.DISABLE_BETA };
			break;
		}
	}

	return state;
};
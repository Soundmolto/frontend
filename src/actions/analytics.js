import { API_ENDPOINT } from '../api';
import { ANALYTICS } from '../enums/analytics';
import { prefill_auth } from '../prefill-authorized-route';

export async function get_analytics (dispatch, { token }) {
	let returnObject = {};

	const data = await fetch(`${API_ENDPOINT}/analytics`, {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			...prefill_auth(token)
		}
	});

	if (data.status === 200) {
		returnObject = {
			type: ANALYTICS.ANALYTICS_FETCHED_SUCCESSFULLY,
			payload: await data.json()
		}
	} else {
		returnObject = {
			type: ANALYTICS.ANALYTICS_FETCHED_UNSUCCESSFULLY,
			payload: {}
		};
	}

	return dispatch(returnObject);
};

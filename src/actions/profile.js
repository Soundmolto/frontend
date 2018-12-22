import { API_ENDPOINT } from '../api';
import { USER } from '../enums/user';
import { prefill_auth } from '../prefill-authorized-route';

export async function edit_profile (dispatch, { profile, token, id }) {
    let returnObject = {};

    try {
        const data = await fetch(`${API_ENDPOINT}/users/${id}`, {
            body: JSON.stringify(profile),
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...prefill_auth(token)
            }
        });

        if (data.status === 200) {
            returnObject = {
                type: USER.PROFILE_UPDATE_SUCCESS,
                payload: await data.json()
            }
        } else {
            throw new Error(data.statusText);
        }

    } catch (error) {
        returnObject = {
            type: USER.PROFILE_UPDATE_FAILURE,
            payload: { error }
        };
    } finally {
        if (returnObject.error == null) {
            dispatch({
                type: USER.HAS_NEW_DATA,
                payload: Object.assign({}, returnObject.payload)
            })
        }
        return dispatch(returnObject);
    }
};
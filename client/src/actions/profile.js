import { GET_PROFILE, PROFILE_ERROR } from "./types"
import axios from "axios";
import { setAlert } from "./alert";

export const getCurrentProfile = () => {
    return async dispatch => {
        try {
            const res = await axios.get('/api/profiles/me');
            dispatch({
                type: GET_PROFILE,
                payload: res
            });

        } catch (err) {

            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });

        }
    }
}

export const createProfile = (formData, history, edit = false) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {

        const res = await axios.post('api/profiles', formData, config);

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        if (!edit) {
            history.push('/dashboard');
        }

    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(err =>
                dispatch(setAlert(err.msg, 'danger'))
            );
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

    }

}

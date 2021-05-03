import { GET_PROFILE, PROFILE_ERROR } from "./types"
import axios from "axios";
import { setAlert } from "./alert";

export const getCurrentProfile = () => {
    return async dispatch => {
        try {
            const res = await axios.get('/api/profiles/me');
            console.log('get profile res', res);
            dispatch({
                type: GET_PROFILE,
                payload: res
            });

        } catch (err) {

            console.log('get profile err', err);
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });

        }
    }
}

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

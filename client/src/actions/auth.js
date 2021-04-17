import { REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR } from "./types";
import axios from "axios";
import { setAlert } from './alert';
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/api/auth');
        console.log('loadUser', res);
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
}

// Register user 
export const register = ({name, email, password}) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('/api/users', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: {
                token: res.data.token
            }
        });
    } catch (error) {

        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(err =>
                dispatch(setAlert(err.msg, 'danger'))
            );
        }

        dispatch({
            type: REGISTER_FAIL,
        });
    }

}
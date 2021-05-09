import { CLEAR_PROFILE, GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETED, GET_PROFILES, GET_REPOS } from "./types"
import axios from "axios";
import { setAlert } from "./alert";

export const getCurrentProfile = () => {
    return async dispatch => {
        try {
            const res = await axios.get('/api/profiles/me');
            dispatch({
                type: GET_PROFILE,
                payload: res.data
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

export const addExperience = (formData, history) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {

        const res = await axios.put('api/profiles/experience', formData, config);

        dispatch(setAlert('Experience Added', 'success'));

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        history.push('/dashboard');

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

export const addEducation = (formData, history) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {

        const res = await axios.put('api/profiles/education', formData, config);

        dispatch(setAlert('Education Added', 'success'));

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        history.push('/dashboard');

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

export const deleteExperience = (id) => async dispatch => {

    try {

        const res = await axios.delete(`api/profiles/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Removed', 'success'));

    } catch (err) {

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }

}

export const deleteEducation = (id) => async dispatch => {

    try {

        const res = await axios.delete(`api/profiles/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education Removed', 'success'));

    } catch (err) {

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }

}

// delete account and profile
export const deleteAccount = () => async dispatch => {

    if (window.confirm('Are you sure? This can NOT be undone!')) {
        try {

            await axios.delete(`api/profiles`);
    
            dispatch({
                type: CLEAR_PROFILE
            });

            dispatch({
                type: ACCOUNT_DELETED
            });
    
            dispatch(setAlert('Your account has been deleted', 'success'));
    
        } catch (err) {
    
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }
    }

}

// get all profiles
export const getProfiles = () => async dispatch => {

    dispatch({ type: CLEAR_PROFILE });

    try {
        const res = await axios.get('/api/profiles');
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

    }

}

// get profile by Id
export const getProfileById = id => async dispatch => {

    try {
        const res = await axios.get(`/api/profiles/user/${id}`);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

    }

}

// get github repos
export const getGithubRepos = username => async dispatch => {

    try {
        const res = await axios.get(`/api/profiles/github/${username}`);

        dispatch({
            type: GET_REPOS,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

    }

}

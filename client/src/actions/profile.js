import axios from 'axios'

import {GET_PROFILE, PROFILE_ERROR, NO_PROFILE_ERROR, UPDATE_PROFILE, CLEAR_PROFILE, DELETE_ACCOUNT} from "./types";
import {setAlert} from "./alert";


export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('http://localhost:5000/api/profile/me')
        if (res.data.msg === 'Profile not found') {
            dispatch({
                type: NO_PROFILE_ERROR,
                payload: res.data
            })
            return null
        } else {
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
            return null
        }
    } catch (e) {
        console.log(`problem with actions.profile.getCurrentProfile ${e.toString()}`)
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        })
    }
}

export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            }
        }

        console.log('actions.profile.createProfile - Hitting POST /apt/profile')

        const res = await axios.post('http://localhost:5000/api/profile', formData, config)

        console.log('actions.profile.createProfile - Done hitting POST /apt/profile')

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

        dispatch(setAlert(edit ? 'Profile updated' : 'Profile created', 'success'))

        if(!edit){
            history.push('/dashboard')
        }

    } catch (e) {
        const errors = e.response.data.errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        })

    }
}

export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            }
        }

        const res = await axios.put('http://localhost:5000/api/profile/experience', formData, config)

        console.log('actions.profile.createProfile - Done hitting POST /apt/profile')

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Experience Added', 'success'))

        history.push('/dashboard')

    } catch (e) {
        const errors = e.response.data.errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        })

    }
}


export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            }
        }

        const res = await axios.put('http://localhost:5000/api/profile/education', formData, config)

        // console.log('actions.profile.createProfile - Done hitting POST /apt/profile')

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Education Added', 'success'))

        history.push('/dashboard')

    } catch (e) {
        const errors = e.response.data.errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        })

    }
}

export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`http://localhost:5000/api/profile/experience/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience Removed', 'success'))
    } catch (e) {

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        })
    }
}

export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`http://localhost:5000/api/profile/education/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Education Removed', 'success'))
    } catch (e) {

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        })
    }
}

export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure? This can not be undone')){
        try {
            const res = await axios.delete(`http://localhost:5000/api/profile`)
            dispatch({ type: CLEAR_PROFILE })
            dispatch({ type: DELETE_ACCOUNT })
            dispatch(setAlert('Your account has been permanently deleted'))
        } catch (e) {

            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: e.response.statusText,
                    status: e.response.status
                }
            })
        }
    }

}

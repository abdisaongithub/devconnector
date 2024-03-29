import axios from 'axios'

import { setAlert } from "./alert";
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE
} from "./types";
import setAuthToken from "../utils/setAuthToken";


// Load User
export const loadUser = () => async dispatch => {
    if (localStorage.getItem('token')){
        setAuthToken(localStorage.getItem('token'))
    }
    
    try {
        const res = await axios.get('http://localhost:5000/api/auth')

        console.log('loaded User from auth.loadUser')

        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (e) {
        dispatch({
            type: AUTH_ERROR
        })
        console.log('Can\'t load stuff from GET /apt/auth  file: actions.auth.loadUser')
    }
}


// Register User
export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, email, password})

    try {
        const res = await axios.post('http://localhost:5000/api/users', body, config)
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser())
    } catch (e) {
        // const errors = e.response.data.errors

        if (e.response.data.errors) {
            e.response.data.errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: REGISTER_FAIL
        })
    }

}
// Login User
export const login = ({ email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ email, password })

    try {
        const res = await axios.post('http://localhost:5000/api/auth', body, config)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser())
    } catch (e) {
        const errors = e.response.data.errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: LOGIN_FAIL
        })
    }

}

// Logout User
export const logout = () => dispatch => {
    dispatch({
        type: CLEAR_PROFILE
    })
    dispatch({
        type: LOGOUT
    })
}
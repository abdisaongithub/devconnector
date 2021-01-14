import { REMOVE_ALERT, SET_ALERT } from './types'

export const setAlert = (msg, alertType) => dispatch => {
    const id = Math.floor(Math.random() * 10000)
    // TODO: Replace this random number generation with UUID generating package ( npm install uuid )
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    })
    setTimeout(() => {
        dispatch({ type: REMOVE_ALERT, payload: id })
    }, 3000)
}
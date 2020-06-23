import axios from "axios";
import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  CURRENT_ROOM,
  SET_ROOMS,
  CLEAR_ERRORS,
  SET_ERRORS,
  POST_SCREAM,
  LOADING_UI,
  SET_SCREAM,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
  SUBMIT_REPORT,
  SET_USER_DATA,
  RESET_USER_DATA,
  SET_ACCEPT_ADVERTISE,
} from "../types";

// Get all screams
export const getScreams = (room) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  dispatch({ type: CURRENT_ROOM, payload: room });
  axios
    .get("/screams")
    .then((res) => {
      dispatch({
        type: SET_SCREAMS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_SCREAMS,
        payload: [],
      });
    });
};

export const getScream = (screamId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/scream/${screamId}`)
    .then((res) => {
      dispatch({
        type: SET_SCREAM,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getRoomScreams = (room) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  dispatch({ type: CURRENT_ROOM, payload: room });
  axios
    .get(`/screams/${room}`)
    .then((res) => {
      dispatch({
        type: SET_SCREAMS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_SCREAMS,
        payload: [],
      });
    });
};

export const deleteScream = (screamId, room) => (dispatch) => {
  axios
    .delete(`/scream/${screamId}`)
    .then(() => {
      dispatch({ type: DELETE_SCREAM, payload: screamId });
    })
    .catch((err) => console.log(err));
};

// Post a Room scream
export const postScream = (newScream, room) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`/scream/room/${room}`, newScream)
    .then((res) => {
      dispatch({ type: POST_SCREAM, payload: res.data });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

// Like a scream
export const likeScream = (screamId) => (dispatch) => {
  axios
    .get(`/scream/${screamId}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_SCREAM,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// Unlike a scream
export const unlikeScream = (screamId) => (dispatch) => {
  axios
    .get(`/scream/${screamId}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_SCREAM,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// Submit a comment
export const submitComment = (screamId, commentData) => (dispatch) => {
  axios
    .post(`/scream/${screamId}/comment`, commentData)
    .then((res) => [
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      }),
    ])
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getRoomData = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  dispatch({ type: CURRENT_ROOM, payload: "Home" });
  axios
    .get("/room")
    .then((res) => {
      dispatch({ type: SET_ROOMS, payload: res.data });
    })
    .catch((err) => console.log(err));
};

export const submitReport = (screamId, reportData) => (dispatch) => {
  axios
    .post(`/scream/${screamId}/report`, reportData)
    .then((res) => [
      dispatch({
        type: SUBMIT_REPORT,
        payload: res.data,
      }),
    ])
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getUserData = (avatarName) => (dispatch) => {
  dispatch({ type: RESET_USER_DATA });
  axios
    .get(`/user/${avatarName}`)
    .then((res) => {
      dispatch({ type: SET_USER_DATA, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_USER_DATA, payload: [] });
    });
};

export const getAcceptAdvertise = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/admin/accept")
    .then((res) => {
      dispatch({ type: SET_ACCEPT_ADVERTISE, payload: res.data });
    })
    .catch(() => {
      dispatch({ type: SET_ACCEPT_ADVERTISE, payload: [] });
    });
};

import axios from "axios";
import {
  SET_SCREAM_REPORTS,
  SET_USER_REPORTS,
  LOADING_ADMIN_DATA,
  SET_HOSTS,
  SET_BAN_LIST,
  SET_ADMIN_ERRORS,
  SET_ROOMS,
  SET_ADVERTISE,
} from "../types";

export const getAllScreamReports = () => (dispatch) => {
  dispatch({ type: LOADING_ADMIN_DATA });
  axios
    .get("/reports/scream")
    .then((res) => {
      dispatch({ type: SET_SCREAM_REPORTS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_SCREAM_REPORTS, payload: [] });
    });
};

export const getAllUserReports = () => (dispatch) => {
  dispatch({ type: LOADING_ADMIN_DATA });
  axios
    .get("/reports/user")
    .then((res) => {
      dispatch({ type: SET_USER_REPORTS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_USER_REPORTS, payload: [] });
    });
};

export const setHostStatus = (avatarName, status) => (dispatch) => {
  dispatch({ type: LOADING_ADMIN_DATA });
  axios
    .post(`/admin/setHost/${avatarName}`, status)
    .then((res) => {
      dispatch({ type: SET_HOSTS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_HOSTS, payload: [] });
    });
};

export const getAllHosts = () => (dispatch) => {
  dispatch({ type: LOADING_ADMIN_DATA });
  axios
    .get("/admin/hosts")
    .then((res) => {
      dispatch({ type: SET_HOSTS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_HOSTS, payload: [] });
    });
};

export const deleteHost = (status) => (dispatch) => {
  dispatch({ type: LOADING_ADMIN_DATA });
  axios
    .get(`/admin/delete/${status}`)
    .then((res) => {
      dispatch({ type: SET_HOSTS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_HOSTS, payload: [] });
    });
};

export const addRoom = (room) => (dispatch) => {
  axios
    .post("/room", room)
    .then(() => {
      console.log("Add room complete");
    })
    .catch((err) => {
      dispatch({ type: SET_ADMIN_ERRORS, payload: err.error });
    });
};

export const banUser = (avatarName, banData) => (dispatch) => {
  dispatch({ type: LOADING_ADMIN_DATA });
  axios
    .post(`/admin/ban/${avatarName}`, banData)
    .then((res) => {
      dispatch({ type: SET_BAN_LIST, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_BAN_LIST, payload: [] });
    });
};

export const getAllBanUser = () => (dispatch) => {
  axios
    .get("/admin/ban")
    .then((res) => {
      dispatch({ type: SET_BAN_LIST, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_BAN_LIST, payload: [] });
    });
};

export const releaseBanUser = (avatarName) => (dispatch) => {
  dispatch({ type: LOADING_ADMIN_DATA });
  axios
    .get(`/admin/release/${avatarName}`)
    .then((res) => {
      dispatch({ type: SET_BAN_LIST, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_BAN_LIST, payload: [] });
    });
};

export const deleteRoom = (room) => (dispatch) => {
  axios
    .delete(`/room/delete/${room}`)
    .then((res) => {
      dispatch({ type: SET_ROOMS, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAllAdvertise = () => (dispatch) => {
  dispatch({ type: LOADING_ADMIN_DATA });
  axios
    .get("/admin/advertise")
    .then((res) => {
      dispatch({ type: SET_ADVERTISE, payload: res.data });
    })
    .catch(() => {
      dispatch({ type: SET_ADVERTISE, payload: [] });
    });
};

export const acceptAdvertise = (adsId) => (dispatch) => {
  dispatch({ type: LOADING_ADMIN_DATA });
  axios
    .get(`/admin/advertise/${adsId}`)
    .then((res) => {
      dispatch({ type: SET_ADVERTISE, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteAdvertise = (adsId) => (dispatch) => {
  dispatch({ type: LOADING_ADMIN_DATA });
  axios
    .get(`admin/delete/advertise/${adsId}`)
    .then((res) => {
      dispatch({ type: SET_ADVERTISE, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

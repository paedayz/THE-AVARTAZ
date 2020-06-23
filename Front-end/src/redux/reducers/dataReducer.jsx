import {
  SET_SCREAMS,
  SET_SCREAM,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  LOADING_DATA,
  SET_ROOMS,
  DELETE_SCREAM,
  CURRENT_ROOM,
  POST_SCREAM,
  SUBMIT_COMMENT,
  SUBMIT_REPORT,
  SET_USER_DATA,
  RESET_USER_DATA,
  SET_ACCEPT_ADVERTISE,
} from "../types";

const initialState = {
  screams: [],
  scream: {},
  loading: false,
  current_room: [],
  room: [],
  reports: [],
  userData: [],
  accept_advertise: [],
  loadingUserData: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_SCREAMS:
      return {
        ...state,
        screams: action.payload,
        loading: false,
      };
    case SET_SCREAM:
      return {
        ...state,
        scream: action.payload,
        loading: false,
      };
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      let index = state.screams.findIndex(
        (scream) => scream.screamId === action.payload.screamId
      );
      state.screams[index] = action.payload;
      if (state.scream.screamId === action.payload.screamId) {
        state.scream = action.payload;
      }
      return {
        ...state,
      };
    case DELETE_SCREAM:
      index = state.screams.findIndex(
        (scream) => scream.screamId === action.payload
      );
      state.screams.splice(index, 1);
      return {
        ...state,
      };
    case CURRENT_ROOM:
      return {
        ...state,
        current_room: action.payload,
      };
    case SET_ROOMS:
      return {
        ...state,
        room: action.payload,
        loading: false,
      };
    case POST_SCREAM:
      return {
        ...state,
        screams: [action.payload, ...state.screams],
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        scream: {
          ...state.scream,
          comments: [action.payload, ...state.scream.comments],
        },
      };
    case SUBMIT_REPORT:
      return {
        ...state,
        reports: action.payload,
      };
    case SET_USER_DATA:
      return {
        ...state,
        userData: action.payload,
        loadingUserData: false,
      };
    case RESET_USER_DATA:
      return {
        ...state,
        userData: [],
        loadingUserData: true,
      };

    case SET_ACCEPT_ADVERTISE:
      return {
        ...state,
        accept_advertise: action.payload,
        loading: false,
      };
    default:
      return {
        ...state,
      };
  }
}

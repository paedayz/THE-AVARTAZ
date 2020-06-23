import {
  SET_SCREAM_REPORTS,
  SET_HOSTS,
  LOADING_ADMIN_DATA,
  SET_BAN_LIST,
  SET_ADMIN_ERRORS,
  SET_USER_REPORTS,
  SET_ADVERTISE,
} from "../types";

const initialState = {
  scream_reports: [],
  user_reports: [],
  ban_list: [],
  host_list: [],
  accept_advertise: [],
  advertise_list: [],
  loading: false,
  errors: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_ADMIN_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_SCREAM_REPORTS:
      return {
        ...state,
        scream_reports: action.payload,
        loading: false,
      };
    case SET_USER_REPORTS:
      return {
        ...state,
        user_reports: action.payload,
        loading: false,
      };
    case SET_HOSTS:
      return {
        ...state,
        host_list: action.payload,
        loading: false,
      };
    case SET_BAN_LIST:
      return {
        ...state,
        ban_list: action.payload,
        loading: false,
      };
    case SET_ADMIN_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    case SET_ADVERTISE:
      return {
        ...state,
        advertise_list: action.payload,
        loading: false,
      };
    default:
      return {
        ...state,
      };
  }
}

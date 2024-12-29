export const HOST = process.env.SERVER_URL;
export const API_URl = `${HOST}/api`;
export const AUTH_ROUTES = `${API_URl}/auth`;
export const GIG_ROUTES = `${API_URl}/gigs`;

// User Routes
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/get-user-info`;
export const SET_USER_INFO = `${AUTH_ROUTES}/set-user-info`;
export const SET_USER_IMAGE = `${AUTH_ROUTES}/set-user-image`;

// Gigs Routes
export const ADD_GIG_ROUTE = `${GIG_ROUTES}/add`;
export const GET_USER_GIGS = `${GIG_ROUTES}/get-user-gigs`;
export const GET_GIG_DATA = `${GIG_ROUTES}/get-gig-data`;
export const EDIT_GIG = `${GIG_ROUTES}/edit-gig`;
export const SEARCH_GIGS_ROUTE = `${GIG_ROUTES}/search`;
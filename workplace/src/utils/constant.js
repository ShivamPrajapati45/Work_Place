export const HOST = process.env.SERVER_URL;
export const API_URl = `${HOST}/api`;
export const AUTH_ROUTES = `${API_URl}/auth`;
export const GIG_ROUTES = `${API_URl}/gigs`;
export const ORDER_ROUTES = `${API_URl}/order`;
export const MESSAGE_ROUTES = `${API_URl}/message`;
export const DASHBOARD_ROUTES = `${API_URl}/dashboard`;
export const CHAT_AI = `${API_URl}/ai`

// User Routes
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/get-user-info`;
export const SET_USER_INFO = `${AUTH_ROUTES}/set-user-info`;
export const SET_USER_IMAGE = `${AUTH_ROUTES}/set-user-image`;
export const LOGOUT_ROUTES = `${AUTH_ROUTES}/logout`;
export const EDIT_USER_INFO = `${AUTH_ROUTES}/edit-profile`;
export const EDIT_USER_IMAGE = `${AUTH_ROUTES}/edit-profile-image`;

// Gigs Routes
export const ADD_GIG_ROUTE = `${GIG_ROUTES}/add`;
export const GET_USER_GIGS = `${GIG_ROUTES}/get-user-gigs`;
export const GET_GIG_DATA = `${GIG_ROUTES}/get-gig-data`;
export const EDIT_GIG = `${GIG_ROUTES}/edit-gig`;
export const SEARCH_GIGS_ROUTE = `${GIG_ROUTES}/search`;
export const CHECK_USER_ORDERED_GIG_ROUTE = `${GIG_ROUTES}/check-gig-order`;
export const ADD_REVIEW = `${GIG_ROUTES}/add-review`;
export const GET_GIGS = `${GIG_ROUTES}/get-gigs`;
export const RECOMMENDED_GIGS = `${GIG_ROUTES}/get-recommended-gigs`;
export const GET_SELLER_GIGS = `${GIG_ROUTES}/get-seller-gigs`;

// Orders Routes
export const CREATE_ORDER = `${ORDER_ROUTES}/create`;
export const ORDER_UPDATE_ROUTE = `${ORDER_ROUTES}/update`;
export const ORDER_DELETE_ROUTE = `${ORDER_ROUTES}/delete`;
export const GET_BUYER_ORDERS_ROUTE = `${ORDER_ROUTES}/get-buyer-orders`;
export const GET_SELLER_ORDERS_ROUTE = `${ORDER_ROUTES}/get-seller-orders`;
export const GET_ORDER = `${ORDER_ROUTES}/get`;
export const GET_NOTIFICATIONS = `${ORDER_ROUTES}/unread-messages`;
export const GET_READ_NOTIFICATIONS = `${ORDER_ROUTES}/read-messages`;
export const MARK_READ = `${ORDER_ROUTES}/mark-read`;
export const MARK_READ_SINGLE_NOTIFICATION = `${ORDER_ROUTES}/mark-read-single-notification`;

// Messages Routes
export const GET_UNREAD_MESSAGES = `${MESSAGE_ROUTES}/unread-messages`;
export const MARK_AS_READ = `${MESSAGE_ROUTES}/mark-as-read`;
// socket parts
export const SEND = `${MESSAGE_ROUTES}/send`;
export const RECEIVE = `${MESSAGE_ROUTES}/receive`;

// Dashboard Routes
export const GET_SELLER_DASHBOARD_DATA = `${DASHBOARD_ROUTES}/seller`;

// AI API
export const BIO_SUGGESTION = `${CHAT_AI}/bio`;
export const SKILLS_SUGGESTION = `${CHAT_AI}/skill`;
export const TITLE_SUGGESTION = `${CHAT_AI}/title`;
export const DESCRIPTION_SUGGESTION = `${CHAT_AI}/desc`;
export const FEATURES_SUGGESTION = `${CHAT_AI}/features`;

import { reducerCases } from "./constants";

export const initialState = {
    showLogInModel: false,
    showSignUpModel: false,
    userInfo: undefined,
    isSeller: false,
    gigData: undefined,
    hasOrdered: false,
    reloadReviews: false,
    socket: null,
    onlineUsers: null,
    unreadCount: 0,
};

const reducer = (state, action) => {
    switch (action.type){

        case reducerCases.TOGGLE_LOGIN_MODEL:
            return{
                ...state,
                showLogInModel: action.showLogInModel, 
            };
        
        case reducerCases.SOCKET:
            return {
                ...state,
                socket: action.socket
            };
        
        case reducerCases.UNREAD_COUNT:
            return {
                ...state,
                unreadCount: action.unreadCount
            };
        
        case reducerCases.ONLINE_USERS:
            return {
                ...state,
                onlineUsers: action.onlineUsers
            }

        case reducerCases.TOGGLE_SIGNUP_MODEL:
            return{
                ...state,
                showSignUpModel: action.showSignUpModel, 
            };

        case reducerCases.CLOSE_AUTH_MODEL:
            return{
                ...state,
                showLogInModel: false,
                showSignUpModel: false 
            }

        case reducerCases.SET_USER:
            return{
                ...state,
                userInfo: action.userInfo
            }

        case reducerCases.SWITCH_MODE:
            return{
                ...state,
                isSeller: !state.isSeller
            }

        case reducerCases.SET_GIG_DATA:
            return{
                ...state,
                gigData: action.gigData
            }

        case reducerCases.HAS_USER_ORDERED_GIG:
            return{
                ...state,
                hasOrdered: action.hasOrdered
            };

        case reducerCases.ADD_REVIEW:
            return{
                ...state,
                reviews: [...state.gigData.reviews || [], action.newReview]
            }

        default:
            return state
    };
};

export default reducer

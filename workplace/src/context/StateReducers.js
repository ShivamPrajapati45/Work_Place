import { reducerCases } from "./constants";

export const initialState = {
    showLogInModel: false,
    showSignUpModel: false,
    userInfo: undefined,
    isSeller: false,
    gigData: undefined
};

const reducer = (state, action) => {
    switch (action.type){

        case reducerCases.TOGGLE_LOGIN_MODEL:
            return{
                ...state,
                showLogInModel: action.showLogInModel, 
            };

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

        default:
            return state
    };
};

export default reducer

import {createStore} from "redux";

export type userObject = {
    token: string,
    refresh: string
}

function logIn(state: userObject = {refresh: "", token: ""}, action ) {
    switch(action.type) {
        case "login/success":{
            return {refresh: state.refresh, token: state.token};
        }

        case "login/failed":{
            return {refresh: "", token: ""};
        }

        default:{
            return state;
        }
    }
}

export const loginStore = createStore(logIn);
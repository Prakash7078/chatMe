import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext=createContext();
export const ChatContextProvider=({children})=>{
    const {currentUser}=useContext(AuthContext);
    const INITIAL_STATE={
        chatId:"null",
        user:{},
        selectedChat:false,
    };
    const chatReducer=(state,action)=>{
        switch(action.type){
            case "CHANGE_USER":
                return{
                    ...state,
                    user:action.payload,
                    chatId: currentUser && currentUser.uid && action.payload && action.payload.uid
                    ? currentUser.uid > action.payload.uid
                      ? currentUser.uid + action.payload.uid
                      : action.payload.uid + currentUser.uid
                    : null, 
                };
            case "SELECT_CHAT":
                return{
                    ...state,
                    selectedChat:action.payload,
                }
            default:
                return state;
        }
    }
    const[state,dispatch]=useReducer(chatReducer,INITIAL_STATE);
    return(
        <ChatContext.Provider value={{data:state,dispatch}}>
            {children}
        </ChatContext.Provider>
    )

}
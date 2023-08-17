import React, { useContext, useEffect, useState } from 'react'
import google from '../img/google.jpg';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../ContextAPI/AuthContext';
import { ChatContext } from '../ContextAPI/ChatContext';
import robo from '../img/robo.jpg';
function Chats() {
  const[chats,setChats]=useState([]);
  const{currentUser}=useContext(AuthContext);
  const{data,dispatch}=useContext(ChatContext);
  useEffect(()=>{
    const getChats=()=>{
      const unsub = onSnapshot(doc(db, "userChats",currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      return()=>{
        unsub();
      };
    }
    currentUser.uid && getChats();
  },[currentUser.uid])


  function isToday(timestamp) {
    const today = new Date();
    const date = timestamp.toDate(); // Convert the timestamp to a Date object
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
  function isYesterday(timestamp) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Subtract 1 day from today
    const date = timestamp.toDate(); // Convert the timestamp to a Date object
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  }
//time from timestamp
  const getTime=(timestamp)=>{
    if(timestamp){
      if(isToday(timestamp)){
        return "today";
      }else if(isYesterday(timestamp)){
        return "yesterday";
      }else{
        const date=timestamp.toDate();
        const day=date.getDate();
        const month=date.getMonth();
        const year=date.getFullYear();
        return date.toLocaleDateString([], { day: '2-digit', month: '2-digit',year:'numeric' });
      }
    }
    return ;
  }
  const handleSelect=(u)=>{
    dispatch({type:"CHANGE_USER",payload:u});
    dispatch({type:"SELECT_CHAT",payload:true});
  }
  
  return (
    <div className="chats">
      
      {Object.entries(chats)?.sort((a, b) => (b[1]?.date || 0) - (a[1]?.date || 0)).map((chat) => {
        if (chat[1]?.userInfo) {
          return (
            <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1]?.userInfo)}>
              <img className="userimg"src={chat[1]?.userInfo.photoURL} alt="user" />
              <div className="userChatInfo">
                <span>{chat[1]?.userInfo.displayName}</span>
                <p>{chat[1]?.lastMessage?.text}</p>
              </div>
              <span className="time">
                {chat[1]?.date ? getTime(chat[1]?.date) : null}
              </span>
            </div>
          );
        }
        return null; // Do not render anything if userInfo is not available
      })}
    </div>
  )
}

export default Chats

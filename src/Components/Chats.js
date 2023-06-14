import React, { useContext, useEffect, useState } from 'react'
import google from '../img/google.jpg';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../ContextAPI/AuthContext';
import { ChatContext } from '../ContextAPI/ChatContext';
function Chats() {
  const[chats,setChats]=useState([]);
  const{currentUser}=useContext(AuthContext);
  const{dispatch}=useContext(ChatContext);
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

  const handleSelect=(u)=>{
    dispatch({type:"CHANGE_USER",payload:u});
    dispatch({type:"SELECT_CHAT",payload:true});
    console.log("select chat");
  }

  return (
    <div className="chats">
       {Object.entries(chats)?.sort((a,b)=>b[1].date-a[1].date).map((chat)=>(
        <div className="userChat" key={chat[0]} onClick={()=>handleSelect(chat[1].userInfo)}>
          <img src={chat[1].userInfo.photoURL} alt="user"/>
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>            
          </div>
      </div>
       ))}
    </div>
  )
}

export default Chats
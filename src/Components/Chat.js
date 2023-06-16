import React, { useContext, useState } from 'react'
import { BiVideo} from 'react-icons/bi';
import {IoMdReturnLeft} from 'react-icons/io';
import { BsThreeDots} from 'react-icons/bs';
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../ContextAPI/ChatContext';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../ContextAPI/AuthContext';
function Chat() {
  const {data}=useContext(ChatContext);
  const{currentUser}=useContext(AuthContext);
  const{dispatch}=useContext(ChatContext);
  const[showdots,setShowdots]=useState(false);
  const[showProfile,setShowProfile]=useState(false);
  const handleSelect=()=>{
    dispatch({type:"SELECT_CHAT",payload:false});
  }
  const handleDelete=async()=>{
    try{
      if (currentUser) {
        await deleteDoc(doc(db, "chats", data.chatId));
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId]: null,
        });
      }
    }catch(err){
      console.log(err);
    }
    
    dispatch({type:"CHANGE_USER",payload:null});
  }
  const handleClear=async()=>{
    const chatDocSnapshot=await getDoc(doc(db,"chats",data.chatId));
    if (chatDocSnapshot.exists()) {
      const chatData = chatDocSnapshot.data();
      const messages = chatData.messages;
      await updateDoc(doc(db,"chats",data.chatId),{messages:[]});
    }else{
      Notification.error("No messages");
    }
  }
 
  return (
    <div className='chat'>
      <div className="chatInfo">
        <span><div className="back" onClick={handleSelect}><IoMdReturnLeft/></div><img className="dp"src={data.user?.photoURL} onClick={()=>setShowProfile(!showProfile)}/>{data.user?.displayName}</span>
        {showProfile && <img className='profile' src={data.user?.photoURL}/>}
        <div className="chatIcons">
          <BiVideo/>
          
          <div className='dots' onClick={()=>setShowdots(!showdots)}><BsThreeDots/>
            {data.chatId && showdots && <div className="dotcon">
              <a onClick={handleClear} className="clear">Clear</a>
              <a onClick={handleDelete}>UnFriend</a>
            </div>}
          </div>
        </div>
        
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}

export default Chat
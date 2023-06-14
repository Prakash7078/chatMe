import React, { useContext, useState } from 'react'
import { BiVideo} from 'react-icons/bi';
import { BsFillPersonPlusFill} from 'react-icons/bs';
import {IoMdReturnLeft} from 'react-icons/io';
import { BsThreeDots} from 'react-icons/bs';
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../ContextAPI/ChatContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
function Chat() {
  const {data}=useContext(ChatContext);
  const{dispatch}=useContext(ChatContext);
  const handleSelect=()=>{
    dispatch({type:"SELECT_CHAT",payload:false});
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
        <span><div className="back" onClick={handleSelect}><IoMdReturnLeft/></div>{data.user?.displayName}</span>
        <div className="chatIcons">
          <BiVideo/>
          <BsFillPersonPlusFill/>
          <div className='dots'><BsThreeDots/>
            {data.chatId && <div className="dotcon">
              <a onClick={handleClear}>Clear</a><br/>
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
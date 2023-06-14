import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../ContextAPI/AuthContext';
import { ChatContext } from '../ContextAPI/ChatContext';
import {MdOutlineDeleteOutline} from 'react-icons/md'
import {doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Message({message}) {
  const{currentUser}=useContext(AuthContext);
  const{data}=useContext(ChatContext);
  const timestamp = message.date.toDate(); // Convert the timestamp to a Date object
  const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const handleMsgdelete = async () => {
    try {
      const chatDocRef = doc(db, "chats", data.chatId);
      const chatDocSnapshot = await getDoc(chatDocRef);
  
      if (chatDocSnapshot.exists()) {
        const chatData = chatDocSnapshot.data();
        const messages = chatData.messages;
  
        // Find the index of the message to be deleted
        const messageIndex = messages.findIndex((msg) => msg.id === message.id);
  
        if (messageIndex !== -1) {
          // Remove the message from the messages array
          messages.splice(messageIndex, 1);
          // Update the 'messages' field in the chat document
          await updateDoc(chatDocRef, { messages });
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  
  const ref=useRef();
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"});
  },[message]);
  return (
    <div className={`message ${message.senderId===currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img src={
          message.senderId===currentUser.uid ? currentUser.photoURL:data.user.photoURL
        } alt=""/>
        <span>{timeString}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}<MdOutlineDeleteOutline className="msgdel"onClick={handleMsgdelete}/></p>
        {message.img && <img src={message.img} alt=""/>}
      </div>
      
    </div>
  )
}

export default Message
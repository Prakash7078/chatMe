  import React, { useContext, useEffect, useState } from 'react'
  import Message from './Message';
  import { ChatContext } from '../ContextAPI/ChatContext';
  import { doc, onSnapshot } from 'firebase/firestore';
  import { db } from '../firebase';
  function Messages() {
    const[messages,setMessages]=useState([]);
    const{data}=useContext(ChatContext);
    useEffect(()=>{
      if (data.chatId) {
      const unSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
        if (doc.exists()) {
          setMessages(doc.data().messages);
        }
      });

      return () => {
        unSub();
      };
    }

    },[data.chatId]);
    return (
      <div className='messages'>
          {data.chatId && messages.map((m)=>{
            return <Message message={m} key={m.id}></Message>
          })}
      </div>
    )
  }

  export default Messages
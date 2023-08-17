import React, { useContext, useEffect, useRef, useState } from 'react'
import {IoSend} from 'react-icons/io5';
import {MdOutlineAddPhotoAlternate} from 'react-icons/md';
import {BsEmojiLaughing} from 'react-icons/bs';
import {BsFillMicMuteFill} from 'react-icons/bs';
import { AuthContext } from '../ContextAPI/AuthContext';
import { ChatContext } from '../ContextAPI/ChatContext';
import { Timestamp, arrayUnion, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import {v4 as uuid} from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import EmojiPicker from 'emoji-picker-react';
import Sentiment from 'sentiment';
import { useSpeechRecognition } from 'react-speech-kit';

// const { Configuration, OpenAIApi } = require("openai");

function Input() {
  const[text,setText]=useState("");
  const[img,setImg]=useState(null);
  const[emojiclick,setEmojiclick]=useState(false);
  const{currentUser}=useContext(AuthContext);
  const{data}=useContext(ChatContext);
  const{dispatch}=useContext(ChatContext);
  const[chats,setChats]=useState([]);
  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      setText(result);
    },
    onError: (error) => {
      console.error('Speech recognition error:', error);
    },
  });
  
  // const[aitext,setAitext]=useState("");
  const emojiMapping = {
    positive: '😄',
    slightlyPositive: '🙂',
    neutral: '😐',
    slightlyNegative: '😕',
    negative: '😞',
  };

  const onEmojiClick=(emoji)=>{
    const emojiCharacter = emoji.emoji;
    setText((prevText)=>prevText+emojiCharacter);
  }
  
  
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
  const handleSend=async()=>{
    if(img){
      const storageRef=ref(storage,uuid());
      const uploadTask=uploadBytesResumable(storageRef,img);
      uploadTask.on(
        (error) => {
          //setErr(true);
        }, 
        () =>{
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) =>{
            console.log("file uploaded");
            await updateDoc(doc(db,"chats",data.chatId),{
              messages:arrayUnion({
                id:uuid(),
                text,
                senderId:currentUser.uid,
                date:Timestamp.now(),
                img:downloadURL,
              })
           })
          });
          
        }
      );
    }else if(text==" " && !img){
      NotificationManager.info("Enter the text");
    }else{
      const sentiment=new Sentiment();
      const result = sentiment.analyze(text);
      let sentimentRange;
      if (result.score > 2) {
        sentimentRange = 'positive';
      } else if (result.score > 0) {
        sentimentRange = 'slightlyPositive';
      } else if (result.score === 0) {
        sentimentRange = 'neutral';
      } else if (result.score >= -2) {
        sentimentRange = 'slightlyNegative';
      } else {
        sentimentRange = 'negative';
      }
      NotificationManager.info(`${emojiMapping[sentimentRange]}`);
      await updateDoc(doc(db,"chats",data.chatId),{
          messages:arrayUnion({
            id:uuid(),
            text,
            senderId:currentUser.uid,
            date:Timestamp.now(),
          })
      });

      // if(data.user.uid==='RkRdnEYySOhNrzjVgUZS4IJb2SJ2'){
      //   sendChatMessage(text)
      //     .then((response) => {
      //       setAitext(response);
      //     })
      //     .catch((error) => {
      //       console.error('Error:', error);
      //     });
      //   await updateDoc(doc(db,"chats",data.chatId),{
      //     messages:arrayUnion({
      //       id:uuid(),
      //       aitext,
      //       senderId:data.user.uid,
      //       date:Timestamp.now(),
      //     })
      //   });
      // }

      await updateDoc(doc(db,"userChats",currentUser.uid),{
        [data.chatId+".lastMessage"]:{
          text,
        },
        [data.chatId+".date"]:serverTimestamp(),
      });
      await updateDoc(doc(db,"userChats",data.user.uid),{
        [data.chatId+".lastMessage"]:{
          text,
        },
        [data.chatId+".date"]:serverTimestamp(),
      });
    }
    setText(" ");
    setImg(null);
  }
  return (
    <div className='input'>
      <p className="emoji" onClick={()=>setEmojiclick(!emojiclick)} >
      😊
      </p>
      {emojiclick && <div className='emoji-box'>
      <EmojiPicker onEmojiClick={onEmojiClick}/>
      </div>}
      <input type="text" placeholder='Type something...' onChange={(e)=>setText(e.target.value)} value={text} onClick={()=>setEmojiclick(false)}/>
      <div className="send">
        <div className='mike' onMouseDown={listen} onMouseUp={stop}><BsFillMicMuteFill/></div>
        <input type="file" style={{display:"none"}} id="file" onChange={e=>setImg(e.target.files[0])}/>
        <label htmlFor='file'>
          <MdOutlineAddPhotoAlternate/>
        </label>
        <button onClick={handleSend}><IoSend /></button>
      </div>
      <NotificationContainer/>
    </div>
  )
}

export default Input
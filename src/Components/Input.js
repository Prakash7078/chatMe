import React, { useContext, useState } from 'react'
import { IoAttach} from 'react-icons/io5';
import {MdOutlineAddPhotoAlternate} from 'react-icons/md';
import {BsEmojiLaughing} from 'react-icons/bs';
import { AuthContext } from '../ContextAPI/AuthContext';
import { ChatContext } from '../ContextAPI/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import {v4 as uuid} from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';


function Input() {
  const[text,setText]=useState("");
  const[img,setImg]=useState(null);
  const{currentUser}=useContext(AuthContext);
  const{data}=useContext(ChatContext);
  const{dispatch}=useContext(ChatContext);
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
      await updateDoc(doc(db,"chats",data.chatId),{
          messages:arrayUnion({
            id:uuid(),
            text,
            senderId:currentUser.uid,
            date:Timestamp.now(),
          })
      });
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
      <div className="emoji" onClick={()=>NotificationManager.info("Press Win+v")} >
      <BsEmojiLaughing/>
      </div>
      <input type="text" placeholder='Type something...' onChange={(e)=>setText(e.target.value)} value={text}/>
      <div className="send">
        <IoAttach/>
        <input type="file" style={{display:"none"}} id="file" onChange={e=>setImg(e.target.files[0])}/>
        <label htmlFor='file'>
          <MdOutlineAddPhotoAlternate/>
        </label>
        <button onClick={handleSend}>send</button>
      </div>
      <NotificationContainer/>
    </div>
  )
}

export default Input
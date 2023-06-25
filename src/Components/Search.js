  import React, { useContext, useEffect, useState } from 'react'
  import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
  import { db } from '../firebase';
  import { AuthContext } from '../ContextAPI/AuthContext';
  import { BsFillPersonPlusFill } from 'react-icons/bs';
  import { BsFillChatRightTextFill } from 'react-icons/bs';
import { ChatContext } from '../ContextAPI/ChatContext';

  function Search() {
    const[userName,setUserName]=useState(" ");
    const[user,setUser]=useState(null);
    const[err,setErr]=useState(false);
    const[exist,setExist]=useState(false);
    const {currentUser}=useContext(AuthContext);
    const{data,dispatch}=useContext(ChatContext);
    useEffect(() => {
      const checkExistence = async () => {
        const combinedId =
          currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        const res1 = await getDoc(doc(db, 'chats', combinedId));
        setExist(res1.exists());
      };
      if (user) {
        checkExistence();
      }
    }, [user]);
    const handleSearch = async () => {
      setUser(null);
      setErr(false);
      if(userName.length<=1){
        return ;
      }
      const querySnapshot = await getDocs(collection(db, "users"));
      const matchingUsers = querySnapshot.docs.filter((doc) =>
        doc.data().displayName.toLowerCase().includes(userName.toLowerCase())
      );
    
      if (matchingUsers.length > 0) {
        setUser(matchingUsers[0].data());
        setErr(false);
      } else {
        setErr(true);
      }
    };
   
    const handleSelect=async()=>{
      const combinedId=currentUser.uid > user.uid ? currentUser.uid+user.uid : user.uid+currentUser.uid;
      try{
        const res=await getDoc(doc(db,"chats",combinedId));
        if(!res.exists()){
          await setDoc(doc(db,"chats",combinedId),{messages:[]});
          //create user chats
          await updateDoc(doc(db,"userChats",currentUser.uid),{
            [combinedId+".userInfo"]:{
              uid:user.uid,
              displayName:user.displayName,
              photoURL:user.photoURL,
            },
            [combinedId+".date"]:serverTimestamp()
          });
          await updateDoc(doc(db,"userChats",user.uid),{
            [combinedId+".userInfo"]:{
              uid:currentUser.uid,
              displayName:currentUser.displayName,
              photoURL:currentUser.photoURL
            },
            [combinedId+".date"]:serverTimestamp()
          });

        }else{
          console.log("message choose");
          dispatch({type:"CHANGE_USER",payload:user});
          dispatch({type:"SELECT_CHAT",payload:true});
        }
      }catch(err){
        setErr(true);
      }
      setUser(null);
      setUserName(" ");
    }
    const handleChange=(e)=>{
      setUserName(e.target.value);
      handleSearch();
    }
    return (
      <div className='search'>
        <div className="searchform">
          <input type="text" placeholder='Search User'onChange={handleChange} />
        </div>
        {err && <span>User not Found!</span>}
        {user && <div className="userChat" >
          <img src={user.photoURL} alt="user"/>
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
          <div className="addfrd">
            {!exist && <BsFillPersonPlusFill onClick={handleSelect}/>}
            {exist && <BsFillChatRightTextFill onClick={handleSelect()}/>}
          </div>
        </div>}
      </div>
    )
  }

  export default Search
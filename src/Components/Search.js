  import React, { useContext, useState } from 'react'
  import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
  import { db } from '../firebase';
  import { AuthContext } from '../ContextAPI/AuthContext';
  import { BsFillPersonPlusFill } from 'react-icons/bs';

  function Search() {
    const[userName,setUserName]=useState(" ");
    const[user,setUser]=useState(null);
    const[err,setErr]=useState(false);
    const {currentUser}=useContext(AuthContext);
    const handleSearch=async()=>{
      setUser(null);
      setErr(true);
      const q=query(collection(db,"users"),where("displayName","==",userName));
      try{
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((d) => {
          setUser(d.data());
          setErr(false);
        });
      }catch(err){
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

        }
      }catch(err){
        setErr(true);
      }
      setUser(null);
      setUserName(" ");
    }
    return (
      <div className='search'>
        <div className="searchform">
          <input type="text" placeholder='Search User'onChange={e=>setUserName(e.target.value)} />
          <button onClick={handleSearch}>Search</button>
        </div>
        {err && <span>User not Found!</span>}
        {user && <div className="userChat" >
          <img src={user.photoURL} alt="user"/>
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
          <div className="addfrd">
            <BsFillPersonPlusFill onClick={handleSelect}/>
          </div>
        </div>}
      </div>
    )
  }

  export default Search
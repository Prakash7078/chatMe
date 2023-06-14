import React, { useContext, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import Chat from '../Components/Chat'
import classNames from 'classnames';
import { ChatContext } from '../ContextAPI/ChatContext';

function Home() {
  const { data: { selectedChat } } = useContext(ChatContext);
  const isMobileScreen = window.innerWidth <= 480;
  return (
    <div className="home">
        {!isMobileScreen && <div className="container">
            <Sidebar/>
            <Chat/>
        </div>}
        {isMobileScreen && <div className="container">
          {!selectedChat?<Sidebar/>:<Chat/>}  
        </div>}
    </div>
  )
}
export default Home;
import React from 'react'
import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';
function Sidebar() {
  return (
    <div className='sidebar'>
      <Navbar/>
      <Search/>
      <div className="chatBar">
      <Chats/>
      </div>
    </div>
  )
}

export default Sidebar
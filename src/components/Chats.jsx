import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

import '../styles/Chats.css'
import { useNavigate } from "react-router-dom";
import ApiMethods from "../ApiMethods";
import Loading from "./Loading";

function Chats() {
    const nav = useNavigate();
    const api = useMemo(()=>ApiMethods(nav),[]);

    const [friend, setFriend] = useState('');
    const [friendList, setFriendList] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [chats,setChats] = useState([]);

    const chatRef = useRef(null);

    
    useEffect(()=>{api.Friend.get().then(res=>{
      if (res && res.length > 0) {
        setFriendList(res);
        setFriend(res[0].user.id);
        api.Message.get(res[0].user.id).then(res=>setChats(res));
      }
    })},[]);
    useEffect(()=>{window.scrollTo({top:window.innerHeight,left:0,behavior:'smooth'})},[chats]);
  
    return (
      <>
        <Header></Header>
        <main>
          <Sidebar></Sidebar>
          <div className="scroll">
            <div className="chat" ref={chatRef}>
              <div className="select-friend">
                  <select name="friend" id="friend" value={friend} onChange={async e=>{
                      if (e.target.value === '') return;
                      setFriend(e.target.value);
                      const res = await api.Message.get(e.target.value);
                      setChats(res);
                      }}>
                      {friendList ? friendList.map(f => <option key={f.user.id} value={f.user.id}>{f.user.username}</option>) : <option value="loading"></option>}
                  </select>
              </div>
              <div className="messages">
                  <ul>
                      {chats ? (
                          chats.map(msg => <li key={msg.id} className={msg.senderId == friend ? 'friend':'you'}>
                              <p>{msg.content}</p>
                              <div>{new Date(msg.timestamp).toLocaleString()}</div>
                          </li>)
                      ) : <li><Loading/></li>}
                  </ul>
              </div>
              <form className="new-message">
                  <input type="text" name="" id="" value={newMessage} onChange={e=>setNewMessage(e.target.value)} placeholder="hey there..."/>
                  <button onClick={async e=>{
                      e.preventDefault();
                      setNewMessage('');
                      await api.Message.add(parseInt(friend),newMessage);
                      setChats(await api.Message.get(friend));
                      await api.Message.add(null,null,parseInt(friend));
                      setChats(await api.Message.get(friend));
                  }}>Send</button>
              </form>
            </div>
          </div>
        </main>
      </>
    )
  }

export default Chats;
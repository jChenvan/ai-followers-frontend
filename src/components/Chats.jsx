import { useEffect, useRef, useState } from "react";
import useApi from "../util/useApi";
import Header from "./Header";
import Sidebar from "./Sidebar";

import '../styles/Chats.css'

function Chats() {
    const [friend, setFriend] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [chats,setChats] = useState([]);

    const chatRef = useRef(null);

    const [friends,friendError,friendLoading,friendReload] = useApi('http://localhost:3000/characters/','GET',undefined,{
     Authorization:localStorage.token,
    });

    useEffect(()=>{chatRef.current.scrollTop = chatRef.current.scrollHeight},[chats]);
  
    return (
      <>
        <Header></Header>
        <main>
          <Sidebar></Sidebar>
          <div className="chat" ref={chatRef}>
            <div className="select-friend">
                <select name="friend" id="friend" value={friend} onChange={async e=>{
                    if (e.target.value === '') return;
                    setFriend(e.target.value);
                    const res = await fetch(`http://localhost:3000/messages/${e.target.value}`,{
                        method:'GET',
                        headers:{
                            "Content-Type":"application/json",
                            Authorization:localStorage.token,
                        },
                    });
                    setChats(await res.json());
                    }}>
                    <option value="">Select friend</option>
                    {friends ? friends.map(f => <option key={f.user.id} value={f.user.id}>{f.user.username}</option>) : <option value="loading">loading</option>}
                </select>
            </div>
            <div className="messages">
                <ul>
                    {chats ? (
                        chats.map(msg => <li key={msg.id} className={msg.senderId == friend ? 'friend':'you'}>
                            <p>{msg.content}</p>
                            <div>{new Date(msg.timestamp).toLocaleString()}</div>
                        </li>)
                    ) : <div>Loading</div>}
                </ul>
            </div>
            <form className="new-message">
                <input type="text" name="" id="" value={newMessage} onChange={e=>setNewMessage(e.target.value)}/>
                <button onClick={async e=>{
                    e.preventDefault();
                    setChats([...chats,{id:crypto.randomUUID(),content:newMessage, timestamp:Date.now()}]);
                    const res = await fetch('http://localhost:3000/messages/',{
                        method:'POST',
                        body:JSON.stringify({
                            recipientId:parseInt(friend),
                            content:newMessage
                        }),
                        headers:{
                            "Content-Type":"application/json",
                            Authorization:localStorage.token,
                        }
                    });
                    const stuff = await res.json();
                    setChats(old => [...(old.slice(0,-1)),stuff.msg,stuff.reply]);
                    setNewMessage('');
                }}>Send</button>
            </form>
          </div>
        </main>
      </>
    )
  }

export default Chats;
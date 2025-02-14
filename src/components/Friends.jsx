import Header from "./Header";
import Sidebar from "./Sidebar";

import '../styles/Friends.css'
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiMethods from "../ApiMethods";

function Friends() {
    const nav = useNavigate();
    const api = useMemo(()=>ApiMethods(nav),[]);

    const [friends,setFriends] = useState();

    const [name , setName] = useState('');
    const [prompt, setPrompt] = useState('');
    const [focus, setFocus] = useState(null);

    const optionsRef = useRef(null);

    useEffect(()=>{api.Friend.get().then(res=>setFriends(res))},[]);

    return <>
    <Header></Header>
    <main>
        <Sidebar></Sidebar>
        <div className="scroll">
            <div className="friends">
                <dialog ref={optionsRef} onClick={async e=>{
                    if (e.target === optionsRef.current) optionsRef.current.close();
                }}>
                    <div>
                        <button onClick={async()=>{
                            await api.Friend.remove(focus);
                            setFriends(await api.Friend.get());
                            optionsRef.current.close();
                        }}>delete</button>
                    </div>
                </dialog>
                <form action="">
                    <input type="text" placeholder="name" value={name} onChange={e=>setName(e.target.value)}/>
                    <textarea name="" id="" placeholder="prompt" value={prompt} onChange={e=>setPrompt(e.target.value)}></textarea>
                    <button onClick={async e=>{
                        e.preventDefault();
                        await api.Friend.add(name,prompt);
                        setFriends(await api.Friend.get());
                        setName('');
                        setPrompt('');
                    }}>submit</button>
                </form>
                <ul>
                    {friends ? friends.toReversed().map(f=><li key={f.user.id}>
                        <img src="robo.png" alt="" width={70} style={{filter:`hue-rotate(${f.user.hueRotation}deg)`}}/>
                        <h1>@{f.user.username}</h1>
                        <button onClick={()=>{
                            setFocus(f.user.id);
                            optionsRef.current.showModal();
                        }}><img src="dots-vertical.svg" alt="" width={30}/></button>
                        <p>{f.prompt}</p>
                    </li>):<li>Loading</li>}
                </ul>
            </div>
        </div>
    </main>
    </>
}

export default Friends
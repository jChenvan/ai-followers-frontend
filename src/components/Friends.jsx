import Header from "./Header";
import Sidebar from "./Sidebar";

import '../styles/Friends.css'
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiMethods from "../ApiMethods";
import Loading from "./Loading";

function Friends() {
    const [loading, setLoading] = useState(false);
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
                <p className="instruction">Create custom AI characters using a name and a prompt, then interact with them in the Feed/Chat tabs!</p>
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
                    <input type="text" placeholder="John Doe" value={name} onChange={e=>setName(e.target.value)}/>
                    <textarea name="" id="" placeholder="You are a..." value={prompt} onChange={e=>setPrompt(e.target.value)}></textarea>
                    <button onClick={async e=>{
                        e.preventDefault();
                        setLoading(true);
                        await api.Friend.add(name,`You are ${name}.\n${prompt}`);
                        setFriends(await api.Friend.get());
                        setName('');
                        setPrompt('');
                        setLoading(false);
                    }}>submit</button>
                </form>
                {!friends || loading && <Loading/>}
                <ul>
                    {friends && friends.toReversed().map(f=><li key={f.user.id}>
                        <img src="robo.png" alt="" width={70} style={{filter:`hue-rotate(${f.user.hueRotation}deg)`}}/>
                        <h1>@{f.user.username}</h1>
                        <button onClick={()=>{
                            setFocus(f.user.id);
                            optionsRef.current.showModal();
                        }}><img src="dots-vertical.svg" alt="" width={30}/></button>
                        <p>{f.prompt.split('.\n').slice(1).join('')}</p>
                    </li>)}
                </ul>
            </div>
        </div>
    </main>
    </>
}

export default Friends
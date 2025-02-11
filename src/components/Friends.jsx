import Header from "./Header";
import Sidebar from "./Sidebar";
import useApi from "../util/useApi";

import '../styles/Friends.css'
import { useRef, useState } from "react";

function Friends() {
    const [friends,friendError,friendLoading,friendReload] = useApi('http://localhost:3000/characters/','GET',undefined,{
     Authorization:localStorage.token,
    });

    const [name , setName] = useState('');
    const [prompt, setPrompt] = useState('');
    const [focus, setFocus] = useState(null);

    const optionsRef = useRef(null);

    return <>
    <Header></Header>
    <main>
        <Sidebar></Sidebar>
        <div className="friends">
            <dialog ref={optionsRef} onClick={async e=>{
                if (e.target === optionsRef.current) {
                    optionsRef.current.close();
                }
                await fetch(`http://localhost:3000/characters/${focus}`,{
                    method:"DELETE",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:localStorage.token,
                    }
                });
                friendReload();
                optionsRef.current.close();
            }}>
                <button>delete</button>
            </dialog>
            <form action="">
                <input type="text" placeholder="name" value={name} onChange={e=>setName(e.target.value)}/>
                <textarea name="" id="" placeholder="prompt" value={prompt} onChange={e=>setPrompt(e.target.value)}></textarea>
                <button onClick={async ()=>{
                    await fetch('http://localhost:3000/characters/',{
                        method:'POST',
                        body:JSON.stringify({
                            username:name,
                            prompt
                        }),
                        headers:{
                            "Content-Type":"application/json",
                            Authorization:localStorage.token,
                        }
                    });
                    friendReload();
                    setName('');
                    setPrompt('');
                }}>submit</button>
            </form>
            <ul>
                {friends ? friends.map(f=><li key={f.user.id}>
                    <img src="/robo.png" alt="" width={70} style={{filter:`hue-rotate(${f.user.hueRotation}deg)`}}/>
                    <h1>@{f.user.username}</h1>
                    <button onClick={()=>{
                        setFocus(f.user.id);
                        optionsRef.current.showModal();
                    }}><img src="/dots-vertical.svg" alt="" width={30}/></button>
                    <p>{f.prompt}</p>
                </li>):<li>Loading</li>}
            </ul>
        </div>
    </main>
    </>
}

export default Friends
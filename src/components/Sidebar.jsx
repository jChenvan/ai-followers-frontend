import { useRef, useState } from "react"
import ProfilePic from '/man.png'
import '../styles/Sidebar.css'
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const dialogRef = useRef(null);
    const nav = useNavigate();

    return (<>
    <dialog ref={dialogRef} onClick={event => {if (event.target === dialogRef.current) {dialogRef.current.close()}}}>
        <div>
            <button onClick={
                () => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    nav('/ai-followers-frontend/login',{replace:true});
                }
            }>Log out</button>
        </div>
    </dialog>
    <nav>
        <div>
            <ul>
                <li><button onClick={()=>nav('/ai-followers-frontend/feed',{replace:true})}>Feed</button></li>
                <li><button onClick={()=>nav('/ai-followers-frontend/messages',{replace:true})}>Chats</button></li>
                <li><button onClick={()=>nav('/ai-followers-frontend/friends',{replace:true})}>Friends</button></li>
            </ul>
            <button className="profile" onClick={()=>dialogRef.current.showModal()}>
                <img src={ProfilePic} alt="" width={50} style={{filter:`hue-rotate(${localStorage.hueRotation}deg)`}}/>
                <div className="text">@{localStorage.username}</div>
            </button>
        </div>
    </nav>
    </>)
}

export default Sidebar
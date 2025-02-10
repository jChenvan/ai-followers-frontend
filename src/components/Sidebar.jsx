import { useRef, useState } from "react"
import Search from '/magnify.svg'
import ProfilePic from '/man.png'
import '../styles/Sidebar.css'
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const [query,setQuery] = useState('');
    const dialogRef = useRef(null);
    const nav = useNavigate();

    return (<>
    <dialog ref={dialogRef} onClick={event => {if (event.target === dialogRef.current) {dialogRef.current.close()}}}>
        <div>
            <button onClick={
                () => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    nav('/login',{replace:true});
                }
            }>Log out</button>
        </div>
    </dialog>
    <nav>
        <div className="search">
            <input type="text" value={query} onChange={event=>setQuery(event.target.value)}/>
            <img src={Search} alt="" width={20}/>
        </div>
        <ul>
            <li><button onClick={()=>nav('/feed',{replace:true})}>Feed</button></li>
            <li><button onClick={()=>nav('/messages',{replace:true})}>Chats</button></li>
            <li><button onClick={()=>nav('/friends',{replace:true})}>Friends</button></li>
        </ul>
        <button className="profile" onClick={()=>dialogRef.current.showModal()}>
            <img src={ProfilePic} alt="" width={50} style={{filter:`hue-rotate(${90}deg)`}}/>
            <div className="text">@{localStorage.username}</div>
        </button>
    </nav>
    </>)
}

export default Sidebar
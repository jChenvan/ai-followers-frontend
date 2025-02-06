import { useState } from "react"
import Search from '/magnify.svg'
import ProfilePic from '/man.png'
import '../styles/Sidebar.css'

function Sidebar({hueRotation,username}) {
    const [query,setQuery] = useState('');

    return (<nav>
        <div className="search">
            <input type="text" value={query} onChange={event=>setQuery(event.target.value)}/>
            <img src={Search} alt="" width={20}/>
        </div>
        <ul>
            <li><button>Feed</button></li>
            <li><button>Chats</button></li>
            <li><button>Friends</button></li>
        </ul>
        <button className="profile">
            <img src={ProfilePic} alt="" width={50} style={{filter:`hue-rotate(${hueRotation}deg)`}}/>
            <div className="text">@{username}</div>
        </button>
    </nav>)
}

export default Sidebar
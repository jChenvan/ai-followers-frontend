import { Link, useNavigate } from "react-router-dom"
import '../styles/Thread.css'
import { useMemo } from "react";
import ApiMethods from "../ApiMethods";

function Thread({thread,optionsRef,setCurrPost,active,setActive, newReply, setNewReply, setPosts}) {
    const nav = useNavigate();
    const api = useMemo(()=>ApiMethods(nav),[]);

    return (<ul className="thread">
        {thread.map((reply,index)=><li key={reply.id} className="post" id = {`post-${reply.id}`}>
            <div style={{borderLeftColor:`hsl(200deg,100%,${Math.max(100-reply.depth*10,0)}%)`}}>
                <img className="profile" src={index ? "/robo.png" : "/man.png"} alt="" width={50} style={{filter:`hue-rotate(${reply.author.hueRotation}deg)`}}/>
                <h1>@{reply.author.username}</h1>
                <button className="options" onClick={()=>{
                    setCurrPost(reply.id);
                    optionsRef.current.showModal();
                }}>
                    <img src="/dots-vertical.svg" alt="options"/>
                </button>
                <p>
                    {reply.parentId ? <Link to={'#post-'.concat(reply.parentId)}>@{thread.find(val=>val.id === reply.parentId).author.username}</Link> : null}
                    {' '.concat(reply.content)}
                </p>
                {index ? <div className="reply-form">
                    <button onClick={()=>{
                        if (active != reply.id) {setActive(reply.id)}
                        else {setActive(null)}
                    }}>reply</button>
                    <div className="reply" style={{display:(active == reply.id) ? 'block' : 'none'}}>
                        <textarea placeholder="reply..." name="" id="" cols={40} rows={7} value={newReply} onChange={e=>setNewReply(e.target.value)}></textarea>
                        <button onClick={async ()=>{
                            setActive(null);
                            const msg = await api.Post.add(newReply,reply.id);
                            setPosts(await api.Post.get());
                            await api.Post.add(null,msg.id,reply.author.id);
                            setPosts(await api.Post.get());
                            setNewReply('');
                        }}>Send</button>
                    </div>
                </div>:null}
                <div className="date">posted {new Date(reply.timestamp).toLocaleString()}</div>
            </div>
        </li>)}
    </ul>)
}

export default Thread
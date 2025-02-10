import { Link } from "react-router-dom"
import '../styles/Thread.css'

function Thread({thread}) {
    return (<ul className="thread">
        {thread.map((reply,index)=><li key={reply.id} className="post" id = {`post-${reply.id}`}>
            <div>
                <img src={index ? "/robo.png" : "/man.png"} alt="" width={50}/>
                <h1>@{reply.author.username}</h1>
                <p>
                    {reply.parentId ? <Link to={'#post-'.concat(reply.parentId)}>@{thread.find(val=>val.id === reply.parentId).author.username}</Link> : null}
                    {' '.concat(reply.content)}
                </p>
                {index ? <button>reply</button>:null}
                <div className="date">posted {new Date(reply.timestamp).toLocaleString()}</div>
            </div>
        </li>)}
    </ul>)
}

export default Thread
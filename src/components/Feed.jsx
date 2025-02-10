import useApi from '../util/useApi'
import '../styles/Dashboard.css'
import '../styles/Feed.css'
import Header from './Header'
import Sidebar from './Sidebar'
import Thread from './Thread'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function getReplies(currId, allNodes) {
  const firstDegreeReplies = allNodes.filter(val=>val.parentId === currId);
  const res = [allNodes.find(val=>val.id === currId)];
  firstDegreeReplies.forEach(reply=>{
    res.push(...(getReplies(reply.id,allNodes)));
  });
  return res;
}

function getTopLevel(allNodes) {
  return allNodes
    .filter(val=>val.parentId===null)
    .map(val=>getReplies(val.id,allNodes));
}

function Feed() {
  const [posts,postError,postLoading,reloadPosts] = useApi('http://localhost:3000/posts/','GET',undefined,{
    Authorization:localStorage.token,
  });
  const dialogRef = useRef(null);

  const [newPost,setNewPost] = useState('');

  return (
    <>
      <Header></Header>
      <main>
        <Sidebar></Sidebar>
        <div className='feed'>
          {posts ? (
            getTopLevel(posts).map(thread => <Thread key = {thread[0].id} thread={thread}></Thread>)
          ):'whoa'}
          <button onClick={()=>{
            dialogRef.current.showModal();
            for (const child of dialogRef.current.firstElementChild.firstElementChild.children) {
              child.disabled = false;
            }
            }}>
            +
          </button>
        </div>
      </main>
      <dialog className="new-post" ref={dialogRef} onClick={e=>{
        if (e.target === dialogRef.current) {
          dialogRef.current.close();
        }
      }}>
        <div>
          <form action="">
            <label htmlFor="new-post">New Post</label>
            <textarea name="content" id="new-post" cols={40} rows={7} value={newPost} onChange={e=>setNewPost(e.target.value)}></textarea>
            <button onClick={async e=>{
              e.preventDefault();
              for (const child of dialogRef.current.firstElementChild.firstElementChild.children) {
                child.disabled = true;
              }
              const response = await fetch('http://localhost:3000/posts/',{
                method:'POST',
                body:JSON.stringify({content:newPost}),
                headers:{
                  "Content-Type":"application/json",
                  Authorization:localStorage.token
                }
              });
              reloadPosts();
              dialogRef.current.close();
            }}>New post</button>
          </form>
        </div>
      </dialog>
    </>
  )
}

export default Feed

import useApi from '../util/useApi'
import '../styles/Dashboard.css'
import '../styles/Feed.css'
import Header from './Header'
import Sidebar from './Sidebar'
import Thread from './Thread'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function getReplies(currId, allNodes,depth) {
  const firstDegreeReplies = allNodes.filter(val=>val.parentId === currId);
  const res = [{...(allNodes.find(val=>val.id === currId)),depth}];
  firstDegreeReplies.forEach(reply=>{
    res.push(...(getReplies(reply.id,allNodes,depth+1)));
  });
  return res;
}

function getTopLevel(allNodes) {
  return allNodes
    .filter(val=>val.parentId===null)
    .toSorted((a,b)=>(new Date(b.timestamp) - new Date(a.timestamp)))
    .map(val=>getReplies(val.id,allNodes,0));
}

function Feed() {
  const [posts,postError,postLoading,reloadPosts] = useApi('http://localhost:3000/posts/','GET',undefined,{
    Authorization:localStorage.token,
  });
  const optionsRef = useRef(null);
  const newPostRef = useRef(null);

  const [newPost,setNewPost] = useState('');
  const [newReply, setNewReply] = useState('');
  const [currPost, setCurrPost] = useState(0);
  const [active,setActive] = useState(null);
  const [now,setNow] = useState(Date.now());

  return (
    <>
      <Header></Header>
      <main>
        <Sidebar></Sidebar>
        <div className='feed'>
          <form action="" className="new-post">
            <textarea value={newPost} onChange={e=>setNewPost(e.target.value)} name="post-content" id="post-content" cols="30" rows="10" placeholder='feeling a little...'></textarea>
            <button onClick={async e=>{
              e.preventDefault();
              newPostRef.current.classList.toggle('hidden');
              const response = await fetch('http://localhost:3000/posts/',{
                method:'POST',
                body:JSON.stringify({content:newPost}),
                headers:{
                  "Content-Type":"application/json",
                  Authorization:localStorage.token
                }
              });
              newPostRef.current.classList.toggle('hidden');
              reloadPosts();
              setNewPost('');
            }}>New post</button>
          </form>
          <div className='hidden' ref={newPostRef}>
            <Thread thread={[{
              id:-1,
              content:newPost,
              timestamp:now,
              author:{
                username:localStorage.username,
                hueRotation:localStorage.hueRotation
              }
            }]}></Thread>
          </div>
          {posts ? (
            getTopLevel(posts).map(thread => <Thread key = {thread[0].id} thread={thread} optionsRef={optionsRef} setCurrPost={setCurrPost} active={active} setActive={setActive} newReply={newReply} setNewReply={setNewReply} reloadPosts={reloadPosts}></Thread>)
          ):'whoa'}
        </div>
      </main>
      <dialog className="options" ref={optionsRef} onClick={e=>{
        if (e.target === optionsRef.current) {
          optionsRef.current.close();
        }
      }}>
        <button onClick={async ()=>{
          await fetch(`http://localhost:3000/posts/${currPost}`,{
            method:'DELETE',
            headers:{
              "Content-Type":"application/json",
              Authorization:localStorage.token
            },
          });
          reloadPosts();
          optionsRef.current.close();
        }}>
          Delete
        </button>
      </dialog>
    </>
  )
}

export default Feed

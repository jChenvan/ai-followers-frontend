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
  const optionsRef = useRef(null);

  const [newPost,setNewPost] = useState('');
  const [currPost, setCurrPost] = useState(0);

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
              const response = await fetch('http://localhost:3000/posts/',{
                method:'POST',
                body:JSON.stringify({content:newPost}),
                headers:{
                  "Content-Type":"application/json",
                  Authorization:localStorage.token
                }
              });
              reloadPosts();
              setNewPost('');
            }}>New post</button>
          </form>
          {posts ? (
            getTopLevel(posts).map(thread => <Thread key = {thread[0].id} thread={thread} optionsRef={optionsRef} setCurrPost={setCurrPost}></Thread>)
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

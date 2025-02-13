import '../styles/Dashboard.css'
import '../styles/Feed.css'
import Header from './Header'
import Sidebar from './Sidebar'
import Thread from './Thread'
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiMethods from '../ApiMethods'

function randIndicies(len,num) {
  const res = [];
  const indicies = [];
  for (let i = 0; i < len; i++) {
    indicies.push(i);
  }
  while (num > 0 && indicies.length > 0) {
    const choice = Math.floor(Math.random()*indicies.length);
    res.push(indicies.splice(choice,1)[0])
    num--;
  }
  return res;
}

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
  const nav = useNavigate();
  const api = useMemo(()=>ApiMethods(nav),[]);

  const [posts,setPosts] = useState(null);
  const [friends,setFriends] = useState(null);
  const optionsRef = useRef(null);

  const [newPost,setNewPost] = useState('');
  const [newReply, setNewReply] = useState('');
  const [currPost, setCurrPost] = useState(0);
  const [active,setActive] = useState(null);

  useEffect(()=>{
    api.Post.get().then(res=>setPosts(res));
    api.Friend.get().then(res=>setFriends(res));
  },[]);

  return (
    <>
      <Header></Header>
      <main>
        <Sidebar></Sidebar>
        <div className='scroll'>
          <div className='feed'>
            <form action="" className="new-post">
              <textarea value={newPost} onChange={e=>setNewPost(e.target.value)} name="post-content" id="post-content" cols="30" rows="10" placeholder='feeling a little...'></textarea>
              <button onClick={async e=>{
                e.preventDefault();
                const post = await api.Post.add(newPost);
                setPosts(await api.Post.get());
                const selection = randIndicies(friends.length,3);
                for (const index of selection) {
                  await api.Post.add(null,post.id,friends[index].user.id);
                }
                setPosts(await api.Post.get());
                setNewPost('');
              }}>New post</button>
            </form>
            {posts ? (
              getTopLevel(posts).map(thread => <Thread key = {thread[0].id} thread={thread} optionsRef={optionsRef} setCurrPost={setCurrPost} active={active} setActive={setActive} newReply={newReply} setNewReply={setNewReply} setPosts={setPosts}></Thread>)
            ):'whoa'}
          </div>
        </div>
      </main>
      <dialog className="options" ref={optionsRef} onClick={e=>{
        if (e.target === optionsRef.current) {
          optionsRef.current.close();
        }
      }}>
        <div>
          <button onClick={async ()=>{
            await api.Post.remove(currPost);
            setPosts(await api.Post.get());
            optionsRef.current.close();
          }}>
            Delete
          </button>
        </div>
      </dialog>
    </>
  )
}

export default Feed

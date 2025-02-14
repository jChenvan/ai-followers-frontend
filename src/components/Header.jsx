import Logo from '/unai-logo.png'
import '../styles/Header.css'
import { Link } from 'react-router-dom'
import { useRef } from 'react'

function Header() {
  const menuRef = useRef(null);

  return (
    <header>
        <div className="logo">
            <div className="image"><img src={Logo} alt="logo" width={300}/></div>
            <div className="menu">
              <button onClick={()=>menuRef.current.classList.toggle('hidden')}>
                <img src="/menu.svg" alt="" height={80}/>
              </button>
              <ul ref={menuRef} className='hidden'>
                <li><Link to={'/ai-followers-frontend/feed'}>Feed</Link></li>
                <li><Link to={'/ai-followers-frontend/messages'}>Chats</Link></li>
                <li><Link to={'/ai-followers-frontend/friends'}>Friends</Link></li>
              </ul>
            </div>
        </div>
    </header>
  )
}

export default Header

import Logo from '/unai-logo.png'
import '../styles/Header.css'

function Header() {
  return (
    <header>
        <div className="logo">
            <img src={Logo} alt="logo" width={300}/>
            <div className='text'></div>
        </div>
    </header>
  )
}

export default Header

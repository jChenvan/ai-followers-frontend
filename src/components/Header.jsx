import Logo from '/man-plus-robo.png'
import '../styles/Header.css'

function Header() {
  return (
    <header>
        <div className="logo">
            <img src={Logo} alt="logo" width={150}/>
            <div className='text'><span className='man'>U</span>n<span className='robo'>AI</span></div>
        </div>
    </header>
  )
}

export default Header

import '../styles/Dashboard.css'
import Header from './Header'
import Sidebar from './Sidebar'

function Dashboard() {
  return (
    <>
      <Header></Header>
      <main>
        <Sidebar hueRotation={90} username={'Billy'}></Sidebar>
      </main>
    </>
  )
}

export default Dashboard

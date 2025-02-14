import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/LogIn.css'

function LogIn({isUserNew}) {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const nav = useNavigate();

    return (<div className="login-page">
        <form action="" method="post">
            <h1>{isUserNew ? 'Sign Up' : 'Log In'}</h1>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={username} onChange={e=>setUsername(e.target.value)}/>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={e=>setPassword(e.target.value)}/>
            <button onClick={async event=>{
                event.preventDefault();
                const response = await fetch('https://patient-meagan-jchenvans-org-21d9a8e9.koyeb.app/'.concat(isUserNew ? 'users' : 'log-in'),{
                    method:'POST',
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    }),
                    mode:'cors'
                });
                if (response.status >= 400) {
                    return;
                }
                const data = await response.json();
                if (isUserNew) {
                    nav('/ai-followers-frontend/login',{replace:true});
                } else {
                    localStorage.token = data.token;
                    localStorage.username = username;
                    localStorage.hueRotation = data.hueRotation;
                    nav('/ai-followers-frontend',{replace:true});
                }
            }}>{isUserNew ? 'Sign up' : 'Log in'}</button>
            <Link to={'/ai-followers-frontend'.concat(isUserNew ? '/login':'/signup')}>{isUserNew ? 'Already a user? Log in!' : 'Not a user? Sign up!'}</Link>
        </form>
    </div>)
}

export default LogIn
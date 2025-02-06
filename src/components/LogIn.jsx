import { useState } from "react";

function LogIn({isUserNew}) {

    return (<div className="log-in-page">
        <form action="" method="post">
            <label htmlFor="username"></label>
            <input type="text" id="username" name="username"/>
            <label htmlFor="password"></label>
            <input type="password" id="password" name="password"/>
            <button>Log in</button>
        </form>
    </div>)
}

export default LogIn
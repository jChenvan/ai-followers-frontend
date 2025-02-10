import { useEffect } from "react";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

function useApi (url,method,body,headers) {
    const [data,setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading,setLoading] = useState(true);
    const nav = useNavigate();

    const reload = ()=>{
        fetch(url,{
            method,
            mode: 'cors',
            body: JSON.stringify(body),
            headers
        }).then(res => {
            if (res.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                nav('/login',{replace:true});
            }
            if (res.status >= 400) {
                throw new Error("server error");
            }
            return res.json();
        }).then(res => setData(res))
        .catch(err => setError(err))
        .finally(setLoading(false));
    }

    useEffect(reload,[]);

    return [data,error,loading,reload]
}

export default useApi
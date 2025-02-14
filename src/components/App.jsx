import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";

import Feed from "./Feed";
import LogIn from "./LogIn";
import Chats from "./Chats";
import Friends from "./Friends";

const isAuthenticated = () => {
    return localStorage.token ? true : false;
}

const ProtectedRoute = () => {
    return isAuthenticated() ? <Outlet/> : <Navigate to="/login" replace/>;
}

const router = createBrowserRouter([
    {
        path:'/ai-followers-frontend',
        element:<ProtectedRoute/>,
        children:[
            {path:"",element:<Navigate to="/ai-followers-frontend/feed" replace/>},
            {path:"/ai-followers-frontend/feed", element:<Feed/>},
            {path:"/ai-followers-frontend/messages", element:<Chats/>},
            {path:"/ai-followers-frontend/friends", element:<Friends></Friends>}
        ]
    },
    {
        path:'/ai-followers-frontend/login',
        element: <LogIn isUserNew={false}/>
    },
    {
        path:'/ai-followers-frontend/signup',
        element: <LogIn isUserNew={true}/>
    }
]);

function App() {
    return <RouterProvider router={router}/>
}

export default App

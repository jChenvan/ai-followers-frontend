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
        path:'/',
        element:<ProtectedRoute/>,
        children:[
            {path:"",element:<Navigate to="/feed" replace/>},
            {path:"/feed", element:<Feed/>},
            {path:"/messages", element:<Chats/>},
            {path:"/friends", element:<Friends></Friends>}
        ]
    },
    {
        path:'/login',
        element: <LogIn isUserNew={false}/>
    },
    {
        path:'/signup',
        element: <LogIn isUserNew={true}/>
    }
]);

function App() {
    return <RouterProvider router={router}/>
}

export default App

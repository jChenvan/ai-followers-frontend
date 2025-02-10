import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";

import Feed from "./Feed";
import LogIn from "./LogIn";

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
            {path:"/messages", element:<h1>Hello</h1>},
            {path:"/friends", element:<h1>Hello</h1>}
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

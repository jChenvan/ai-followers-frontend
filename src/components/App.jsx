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
        children:[{path:"",element:<Feed/>}]
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

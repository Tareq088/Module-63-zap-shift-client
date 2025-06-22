import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home/Home";
<<<<<<< HEAD
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
=======
>>>>>>> 68859e2514e559424a274aeeeae6e3ee6f709b06


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children:[
      {
        index:true,
        Component: Home,
      },
    ]
  },
<<<<<<< HEAD
  {
    path:"/",
    Component:AuthLayout,
    children:[
      {
        path:"/login",
        Component: Login
      },
    ]
  },
=======
>>>>>>> 68859e2514e559424a274aeeeae6e3ee6f709b06
]);

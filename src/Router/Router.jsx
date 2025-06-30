import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import PrivateRoute from "../Routes/PrivateRoute";
import SendParcel from "../Pages/SendParcel/SendParcel";
import DashboardLayout from "../Layout/DashboardLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from './../Pages/Dashboard/TrackParcel/TrackParcel';
import BeARider from "../Pages/Dashboard/BeARider/BeARider";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children:[
      {
        index:true,
        Component: Home,
      },
      {
        path:"/coverage",
        Component:Coverage
      },
      {
        path:"/beARider",
        element:<PrivateRoute><BeARider></BeARider></PrivateRoute>
      },
      {
        path: "/sendParcel",
        element:<PrivateRoute><SendParcel></SendParcel></PrivateRoute>
      }
    ]
  },
  {
    path:"/",
    Component:AuthLayout,
    children:[
      {
        path:"/login",
        Component: Login
      },
      {
        path:"/register",
        Component: Register,
      },
    ]
  },
  {
    path:"/dashboard",
    element:<PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children:[
      {
        index: true,
        path:"myParcels",
        element:<MyParcels></MyParcels>
      },
      {
        path:'payment/:parcelId',
        element:<Payment></Payment>
      },
      {
        path:"paymentHistory",
        element:<PaymentHistory></PaymentHistory>
      },
      {
        path:"track",
        Component:TrackParcel
      }
    ]
  }
]);

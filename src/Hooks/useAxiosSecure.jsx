import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { user, logOut, loading } = useAuth(); // i can get user data using{user}
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user?.accessToken) {
      // 🛡 Add request interceptor
      const requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
          return config;
        },
        (error) => Promise.reject(error)
      );

      // ❌ Add response interceptor for 401/403
      const responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.status === 403) {
            navigate("/forbidden");
          } else if (error.status === 401) {
            logOut()
              .then(() => {
                toast.error(`Logged Out for ${error.status} code`);
                navigate("/login");
              })
              .catch((error) => {
                console.log(error.message);
              });
          }
          console.log("error in interceptor", error);
          return Promise.reject(error);
        }
      );
      // 🧹 Clean up interceptors on unmount or dependency change
      return () => {
        axiosInstance.interceptors.request.eject(requestInterceptor);
        axiosInstance.interceptors.response.eject(responseInterceptor);
      };
    }
    // axiosSecure.interceptors.request.use(config=>{
    //     config.headers.Authorization = `Bearer ${user.accessToken}`;
    //     return config;
    // })

    // axiosSecure.interceptors.response.use(
    //   (response) => {
    //     return response;
    //   },
    //   (error) => {
    //     if (error.status === 403) {
    //       navigate("/forbidden");
    //     } else if (error.status === 401) {
    //       logOut()
    //         .then(() => {
    //           toast.error(`Logged Out for ${error.status} code`);
    //           navigate("/login");
    //         })
    //         .catch((error) => {
    //           console.log(error.message);
    //         });
    //     }
    //     console.log("error in interceptor", error);
    //     return Promise.reject(error);
    //   }
    // );
  }, [user, loading, logOut, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;

// import { useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // make sure you're using react-router-dom
// import { AuthContext } from "../provider/AuthContext"; // adjust if your context is in a different path
// import { toast } from "react-toastify";

// const useAxiosSecure = () => {
//   const { user, handleSignOutUser, loading } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//      if (!loading && user?.accessToken) {
//       // 🛡 Add request interceptor
//       const requestInterceptor = axiosInstance.interceptors.request.use(
//         (config) => {
//           config.headers.Authorization = `Bearer ${user.accessToken}`;
//           return config;
//         },
//         (error) => Promise.reject(error)
//       );

//       // ❌ Add response interceptor for 401/403
//       const responseInterceptor = axiosInstance.interceptors.response.use(
//         (response) => response,
//         (error) => {
//           const status = error?.response?.status;

//           if (status === 401 || status === 403) {
//             toast.error(`Access denied (${status}) — you were logged out.`);
//             handleSignOutUser()
//               .then(() => {
//                 navigate("/login");
//               })
//               .catch((err) => console.error("Logout failed:", err));
//           }

//           return Promise.reject(error);
//         }
//       );

//       // 🧹 Clean up interceptors on unmount or dependency change
//       return () => {
//         axiosInstance.interceptors.request.eject(requestInterceptor);
//         axiosInstance.interceptors.response.eject(responseInterceptor);
//       };
//     }
//   }, [user, loading, handleSignOutUser, navigate]);

//   return axiosInstance;
// };

// export default useAxiosSecure;

import axios from 'axios';
import React from 'react';
import useAuth from './useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
})

const useAxiosSecure = () => {
    const {user,logOut} = useAuth(); // i can get user data using{user}
    const navigate = useNavigate();
    axiosSecure.interceptors.request.use(config=>{
        config.headers.Authorization = `Bearer ${user.accessToken}`;
        return config;
    })
    axiosSecure.interceptors.response.use(response =>{
        return response;
    }, error=>{
        if(error.status === 403){
            navigate("/forbidden");
        }
        else if(error.status === 401){
               logOut()
                    .then(()=>{
                        toast.error(`Logged Out for ${error.status} code`)
                        navigate("/login");
                    })
                    .catch(error =>{
                        console.log(error.message)
                    })
        }
        console.log("error in interceptor", error)
        return Promise.reject(error)
    })
   

    return axiosSecure
};

export default useAxiosSecure;
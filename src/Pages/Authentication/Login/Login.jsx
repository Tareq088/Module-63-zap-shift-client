import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { register } from "swiper/element";
import SocialLogin from "../SocialLogin/SocialLogin";
const Login = () => {
    const {register,handleSubmit, formState:{errors}} = useForm();
    const onSubmit = (data) =>{
        console.log(data)
    }
  return (
    <div className="w-[70%]">
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input type="email" {...register("email")} className="input w-full" placeholder="Email" />

          <label className="label">Password</label>
          <input 
            type="password"
            {...register("password", {required:true, minLength:6})} 
            className="input w-full" 
            placeholder="Password" />
            {
              errors.password?.type === 'minLength' && <p className="text-red-500">Password must be 6 character</p>
            }
          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
        <p><small>
            Yet Have No Account! 
            <span className="btn btn-link btn-success"> 
              <Link to='/register'>Register Now</Link>
            </span>  
        </small></p>
      </form>
      <SocialLogin></SocialLogin>
    </div>
  );
};

export default Login;

import React from "react";
import { useForm } from "react-hook-form";
import { register } from "swiper/element";

const Login = () => {
    const {register,handleSubmit} = useForm();
    const onSubmit = (data) =>{
        console.log(data)
    }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input type="email" {...register("email")} className="input" placeholder="Email" />

          <label className="label">Password</label>
          <input type="password"{...register("password")} className="input" placeholder="Password" />

          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;

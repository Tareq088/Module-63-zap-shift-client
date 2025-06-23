import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { Link } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";

const Register = () => {
  const {register, handleSubmit, formState: { errors },} = useForm();
  const {user, createUser} = useAuth();
  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
    .then(result=>{
      console.log(result.user)
    })
    .catch(error =>{
      console.error(error)
    })
  };
  return (
    <div className="w-[70%]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="font-bold text-4xl">Create an Account</h1>
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email")}
            className="input w-full"
            placeholder="Email"
          />

          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            className="input w-full"
            placeholder="Password"
          />
          {errors.password?.type === "required" && (
            <p className="text-red-500">password is required</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500">password must be 6 character</p>
          )}
          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
          <button className="btn btn-primary text-black mt-4">Register</button>
        </fieldset>
        <p><small>Already Have an account <span className="btn btn-link btn-success"> <Link to='/login'>LogIn</Link></span>  </small></p>
      </form>
      <SocialLogin></SocialLogin>
    </div>
  );
};

export default Register;

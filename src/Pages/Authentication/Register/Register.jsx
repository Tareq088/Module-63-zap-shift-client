import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { Link } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";
import useAxios from "../../../Hooks/useAxios";

const Register = () => {
  const[profilePic, setProfilePic] = useState("");
  const {register, handleSubmit, formState: { errors }} = useForm();
  const { user, createUser, updateUserProfile } = useAuth();
  const axiosInstance = useAxios();

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then(  async(result) => {
        console.log(result.user);

              //update user in db
        const userInfo = {
          email: data.email,
          role: "user", //default rol
          createdAt: new Date().toISOString(),
          last_log_In: new Date().toISOString(),
        }
        const userRes = await axiosInstance.post("/users", userInfo);
        console.log(userRes.data)
        
              //update user in firebase
        const userUpdateProfile ={
          displayName:data.name,
          photoURL:profilePic,
        }
        updateUserProfile(userUpdateProfile)
        .then(()=>{
          console.log("name , profile pic updated");
        })
        .catch(error =>{
          console.log(error)
        })
          
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleImageUpload = async(e) =>{
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image);
    const imageURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`
    const res = await axios.post(imageURL, formData);
    setProfilePic(res.data.data.url);
  }
  return (
    <div className="w-[70%]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="font-bold text-4xl">Create an Account</h1>
        <fieldset className="fieldset">
          {/* name field */}
          <label className="label">Your Name</label>
          <input
            type="text"
            {...register("name", {required: true})}
            className="input w-full"
            placeholder="Name"
          />
           {errors.name?.type === "required" && (
            <p className="text-red-500">Name is required</p>
          )}
          {/* image field */}
          <label className="label">Upload Your Photo</label>
          <input
            type="file"
            onChange={handleImageUpload}
            // {...register("", {required: true})}
            className="input w-full py-2 cursor-pointer"
            placeholder="Your Profile Picture.."
          />
           
          {/* email field */}
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email")}
            className="input w-full"
            placeholder="Email"
          />
          {/* password field */}
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
        <p>
          <small>
            Already Have an account{" "}
            <span className="btn btn-link btn-success">
              {" "}
              <Link to="/login">LogIn</Link>
            </span>{" "}
          </small>
        </p>
      </form>
      <SocialLogin></SocialLogin>
    </div>
  );
};

export default Register;

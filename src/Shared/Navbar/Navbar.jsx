import React from 'react';
import { Link, useNavigate } from 'react-router';
import ProFastLogo from '../ProFastLogo/ProFastLogo';
import useAuth from '../../Hooks/useAuth';
import Swal from 'sweetalert2';
import { FaUserCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const Navbar = () => {
    const {user, logOut} = useAuth();
    const navigate = useNavigate();
    const navItems = <>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/sendParcel">Send A Parcel</Link></li>
        <li><Link to="/coverage">Coverage</Link></li>
        
    </>
        const handleLogOut = () =>{
        logOut()
        .then(()=>{
            Swal.fire({icon:"success", title:"Logged Out"});
            navigate("/login");
        })
        .catch(error =>{
            Swal.fire({icon:"error", title:`${error.message}`});
        })
    }
    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {navItems}

                    </ul>
                    </div>
                    <ProFastLogo></ProFastLogo>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                   {navItems}

                    </ul>
                </div>
                <div className="navbar-end h-10">
                    <div className="flex items-center gap-1">
                        {
                            user?
                            <div>
                                <a data-tooltip-id="my-tooltip" data-tooltip-content={`user: ${user?.email}(${user?.displayName})`} className='w-8 p-0.5 rounded-full'>
                                    <img className='rounded-full w-12' src={user?.photoURL}></img>
                                </a>
                                <Tooltip id="my-tooltip" />
                            </div>
                            :
                            <div className='cursor-pointer' onClick={()=>navigate('/auth/login')}>
                                <FaUserCircle  size={35}></FaUserCircle>
                            </div>
                        } 
                   
                        
                            {
                                user?
                                <button onClick={handleLogOut} className="btn btn-outline mr-1 text-xs md:text-base p-1 sm:p-2 text-blue-600 hover:text-red-600">Log Out</button>
                                :
                                <Link to='/login' className="btn btn-outline mr-1 text-xs md:text-base p-1 sm:p-2 text-blue-600 hover:text-red-600">Log In</Link>
                            }
                  
                    </div>
                </div>
                </div>
            </div>
    );
};

export default Navbar;
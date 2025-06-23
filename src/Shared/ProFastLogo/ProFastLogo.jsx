import React from 'react';
import logo from "../../assets/logo.png"
import { Link } from 'react-router';

const ProFastLogo = () => {
    return (
        <Link to="/">
            <div className='flex items-end'>
                <img className='sm:mb-2' src={logo} alt="" />
                <p className='text-xl sm:text-3xl -ms-4 font-extrabold'>ProFast</p>
            </div>
        </Link>
    );
};

export default ProFastLogo;
import React from 'react';
import logo from "../../assets/logo.png"

const ProFastLogo = () => {
    return (
        <div className='flex items-end'>
            <img className='sm:mb-2' src={logo} alt="" />
            <p className='text-xl sm:text-3xl -ms-4 font-extrabold'>ProFast</p>
        </div>
    );
};

export default ProFastLogo;
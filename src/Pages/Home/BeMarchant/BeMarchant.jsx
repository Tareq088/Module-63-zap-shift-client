import React from "react";
import merchantImg from "../../../assets/location-merchant.png"

const BeMarchant = () => {
  return (
    <div>
      <div className="hero bg-[url('be-a-merchant-bg.png')] bg-contain bg-no-repeat bg-top bg-center bg-[#03373D] p-20 rounded-4xl">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src= {merchantImg}
            className="max-w-sm rounded-lg shadow-2xl"
          />
          <div>
            <h1 className="text-5xl font-bold text-white">Merchant and Customer Satisfaction <br /> is Our First Priority</h1>
            <p className="py-6 text-white">
              We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
            </p>
            <button className="btn btn-primary text-black mr-3 rounded-3xl">Become a Merchant</button>
            <button className="btn btn-primary rounded-4xl btn-outline">Earn with Profast Courier</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeMarchant;

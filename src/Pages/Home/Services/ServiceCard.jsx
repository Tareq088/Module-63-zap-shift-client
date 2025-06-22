// src/components/Services/ServiceCard.jsx
import React from 'react';
import { FaShippingFast, FaGlobe, FaBoxes, FaMoneyBillWave, FaBuilding, FaUndo } from "react-icons/fa";

const iconMap = {
  "Express & Standard Delivery": <FaShippingFast className="text-3xl text-primary" />,
  "Nationwide Delivery": <FaGlobe className="text-3xl text-primary" />,
  "Fulfillment Solution": <FaBoxes className="text-3xl text-primary" />,
  "Cash on Home Delivery": <FaMoneyBillWave className="text-3xl text-primary" />,
  "Corporate Service / Contract In Logistics": <FaBuilding className="text-3xl text-primary" />,
  "Parcel Return": <FaUndo className="text-3xl text-primary" />,
};

// const ServiceCard = ({ title, description }) => {
    const ServiceCard = ({ service }) => {
    const {title,description} = service || {} ;
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition-colors duration-300 hover:bg-base-200">
      <div className="card-body items-center text-center">
                        {/* title er moddhe space ache tai bracket notation use kora hoyeche */}
        {iconMap[title]}
        <h3 className="card-title text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;

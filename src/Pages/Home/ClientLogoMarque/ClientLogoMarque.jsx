import React from 'react';
import Marquee from 'react-fast-marquee';
import logo1 from '../../../assets/brands/amazon.png';
import logo2 from '../../../assets/brands/amazon_vector.png';
import logo3 from '../../../assets/brands/casio.png';
import logo4 from '../../../assets/brands/moonstar.png';
import logo5 from '../../../assets/brands/randstad.png';
import logo6 from '../../../assets/brands/start-people 1.png';
import logo7 from '../../../assets/brands/start.png';


const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

const ClientLogoMarque = () => {
  return (
    <section className="bg-base-200 py-10">
      <h2 className="text-center text-2xl font-bold mb-6">Trusted by Leading Brands</h2>

      <Marquee
        direction="left"
        speed={40}
        gradient={false}
        pauseOnHover={true}
        className="space-x-10"
      >
        {logos.map((logo, index) => (
          <div key={index} className="mx-12 flex items-center">
            <img
              src={logo}
              alt={`Client ${index + 1}`}
              className="h-8 object-contain grayscale hover:grayscale-0 transition duration-300"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default ClientLogoMarque;

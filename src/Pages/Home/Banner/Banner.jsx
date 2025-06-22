import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import banner1Img from "../../../assets/banner/banner1.png";
import banner2Img from "../../../assets/banner/banner2.png";
import banner3Img from "../../../assets/banner/banner3.png";

const Banner = () => {
    return (
        <div>
            <Carousel autoPlay={true} infiniteLoop={true}>
                <div>
                    <img src={banner1Img} />
                    <p className="legend">Legend 1</p>
                </div>
                <div>
                    <img src={banner2Img} />
                    <p className="legend">Legend 2</p>
                </div>
                <div>
                    <img src={banner3Img} />
                    <p className="legend">Legend 3</p>
                </div>
            </Carousel>
        </div>
    );
};

export default Banner;
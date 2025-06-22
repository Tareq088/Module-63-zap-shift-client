import React from 'react';
import Banner from '../Banner/Banner';
import Service from '../Services/Service';
import ClientLogoMarque from '../ClientLogoMarque/ClientLogoMarque';
import HorizontalCard from '../HorizontalCard/HorizontalCard';
import BeMarchant from '../BeMarchant/BeMarchant';
import ReviewCarousel from '../ReviewCarousel/ReviewCarousel';


const Home = () => {
    return (
        <div>
            <Banner></Banner>         
            <Service></Service>
            <ClientLogoMarque></ClientLogoMarque>
            <HorizontalCard></HorizontalCard>
            <BeMarchant></BeMarchant>
            <ReviewCarousel></ReviewCarousel>
        </div>
    );
};

export default Home;
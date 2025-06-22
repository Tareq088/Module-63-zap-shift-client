// src/components/ReviewCarousel.jsx

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaArrowLeft, FaArrowRight, FaQuoteLeft } from 'react-icons/fa';
import { useState } from 'react';

const reviews = [
  {
    name: "Awlad Hossin",
    title: "Senior Product Designer",
    review:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
   {
    name: "Nasir Uddin",
    title: "CEO",
    review:
      "As someone with back pain, this made a real difference. Highly recommend to anyone working long hours.",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
   {
    name: "Awlad Hossin",
    title: "Senior Product Designer",
    review:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    name: "Rasel Ahamed",
    title: "CTO",
    review:
      "This tool helps maintain your posture with ease and comfort. It’s a game-changer for long office hours.",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
   {
    name: "Awlad Hossin",
    title: "Senior Product Designer",
    review:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    name: "Nasir Uddin",
    title: "CEO",
    review:
      "As someone with back pain, this made a real difference. Highly recommend to anyone working long hours.",
    avatar: "https://i.pravatar.cc/150?img=3"
  }
];


const ReviewCarousel = () => {
      const [activeIndex, setActiveIndex] = useState(0); // ✅ track which slide is active
  return (
    <div className="py-16 px-4 md:px-10 bg-base-100 text-gray-800">
      <h2 className="text-3xl font-bold text-center mb-10">What Our Customers Say</h2>

      <Swiper
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)} // ✅ update active index
        slidesPerView={1.2}
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        pagination={{
          el: '.custom-pagination',       // ✅ CUSTOM PAGINATION TARGET el=element mane ei custom-pagination jekhane likhchi sekhane dekhabe
          clickable: true
        }}
        navigation={{
          prevEl: '.custom-prev',         // ✅ CUSTOM NAV BUTTON TARGET
          nextEl: '.custom-next'
        }}
        modules={[Pagination, Navigation]}
        breakpoints={{
          768: {
            slidesPerView: 2.2
          },
          1024: {
            slidesPerView: 3
          }
        }}
        className="max-w-7xl mx-auto"
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div 
                className={`bg-white rounded-xl p-6 h-full transition-all duration-300 
                ${index === activeIndex ? 'shadow-xl scale-100' : 'shadow-md opacity-30 scale-95'}
              `}>
              {/* Quotation */}
              <FaQuoteLeft className="text-4xl text-teal-400 mb-4" />

              {/* Review */}
              <p className="text-gray-700 mb-6">{review.review}</p>

              {/* Divider */}
              <hr className="border-dotted border-gray-300 mb-4" />

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.title}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
            {/* ✅ Controls & Pagination (below swiper) */}
      <div className="flex items-center justify-center gap-4 mt-8 w-40 mx-auto">
        <button className="custom-prev p-2 rounded-full bg-base-200 hover:bg-base-300">
          <FaArrowLeft />
        </button>
        <div className="custom-pagination flex gap-2" /> 
        <button className="custom-next p-2 rounded-full bg-base-200 hover:bg-base-300">
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ReviewCarousel;

// src/components/HorizontalCards/HorizontalCardSection.jsx
import trackingImg from '../../../assets/live-tracking.png';
import secureImg from '../../../assets/safe-delivery.png';

const cardData = [
  {
    title: "Live Parcel Tracking",
    description: "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: trackingImg
  },
  {
    title: "Secure Packaging",
    description: "Your products are safely packed to avoid any damage during delivery.",
    image: secureImg
  },
  {
    title: "Real-Time Tracking",
    description: "Track your parcel live from pickup to doorstep in real-time.",
    image: secureImg
  }
];

const HorizontalCard = () => {
  return (
    <section className="py-10 px-4 md:px-10 bg-base-300">
      <div className="space-y-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden p-8"
          >
            {/* Left: Image (30%) */}
            <div className="md:w-[30%] w-full flex items-center justify-center p-4">
              <img
                src={card.image}
                alt={card.title}
                className="object-contain w-full h-full max-h-40 rounded-md"
              />
            </div>

            {/* Divider */}
            <div className="hidden md:block border-1 border-dotted border-gray-400"></div>

            {/* Right: Title + Description (70%) */}
            <div className="md:w-[70%] w-full p-4 flex flex-col justify-center gap-3">
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HorizontalCard;

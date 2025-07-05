import { FaTruckLoading } from 'react-icons/fa';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-primary gap-4">
      {/* 🛻 Icon Animation */}
      <div className="animate-bounce text-5xl text-primary">
        <FaTruckLoading />
      </div>

      {/* ⏳ Text Spinner */}
      <span className="loading loading-dots loading-md text-secondary"></span>

      {/* 🚚 Message */}
      <p className="text-lg font-semibold text-gray-600">
        Loading your parcel data, please wait...
      </p>
    </div>
  );
};

export default Loading;

// utils/addTrackingEvent.js
import useAxiosSecure from './useAxiosSecure';

const useAddTrackingEvent = () => {
  const axiosSecure = useAxiosSecure();

  const addTrackingEvent = async ({  trackingId, status, details,updated_by }) => {
    try {
      const res = await axiosSecure.post('/trackings', {
        trackingId, status, details,updated_by
      });
      return res.data;
    } catch (error) {
      console.error('Failed to add tracking event:', error);
    }
  };
  return addTrackingEvent;
};
export default useAddTrackingEvent;

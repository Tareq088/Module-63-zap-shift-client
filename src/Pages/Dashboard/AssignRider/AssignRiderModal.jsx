import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const AssignRiderModal = ({ parcel, onClose }) => {
    console.log(parcel)
  const axiosSecure = useAxiosSecure();
  const senderDistrict = parcel?.sender?.district;
  const receiverDistrict = parcel?.receiver?.district;

  const { data: riders = [], isLoading } = useQuery({
    queryKey: ['matchingRiders', senderDistrict, receiverDistrict],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders/match?senderDistrict=${senderDistrict}&receiverDistrict=${receiverDistrict}`
      );
      return res.data;
    },
    enabled: !!senderDistrict && !!receiverDistrict,
  });

  const handleAssign = (riderId) => {
    console.log('Assign to:', riderId, 'for parcel:', parcel._id);
    // future logic here
  };

  return (
    <dialog id="assign_rider_modal" className="modal modal-open">
      <div className="modal-box w-11/12 max-w-3xl">
        <h3 className="font-bold text-xl mb-4">Assign Rider</h3>
        {isLoading ? (
          <p>Loading riders...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>District</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {riders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">No matching riders found</td>
                  </tr>
                ) : (
                  riders?.map((rider) => (
                    <tr key={rider._id}>
                      <td>{rider.name}</td>
                      <td>{rider.phone}</td>
                      <td>{rider.district}</td>
                      <td>
                        <button
                          onClick={() => handleAssign(rider._id)}
                          className="btn btn-sm btn-primary"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="modal-action">
          <button onClick={onClose} className="btn">Close</button>
        </div>
      </div>
    </dialog>
  );
};

export default AssignRiderModal;

import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AssignRiderModal = ({ parcel, onClose,refetch }) => {
  console.log(parcel);
  const axiosSecure = useAxiosSecure();
  const senderDistrict = parcel?.sender?.district;
  const receiverDistrict = parcel?.receiver?.district;

  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["matchingRiders", senderDistrict, receiverDistrict],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders/match?senderDistrict=${senderDistrict}&receiverDistrict=${receiverDistrict}`
      );
      return res.data;
    },
    enabled: !!senderDistrict && !!receiverDistrict,
  });
          // after clicking assign==>> patch will be
  const assignMutation = useMutation({
    mutationFn: async ({ parcelId, riderId,riderName,riderPhone, riderEmail }) => {
      const res = await axiosSecure.patch("parcels/assign", {
        parcelId,
        riderId,
        riderName,riderPhone, riderEmail
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("✅ Success", "Rider assigned successfully", "success");
      onClose(); // close the modal
      refetch(); // refetch parcels
    },
    onError: () => {
      Swal.fire("❌ Failed", "Could not assign rider", "error");
    },
  });

  const handleAssign = (riderId,riderName,riderPhone, riderEmail) => {
    Swal.fire({
      title: "Assign this rider?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, assign",
    }).then((result) => {
      if (result.isConfirmed) {
        assignMutation.mutate({ parcelId: parcel._id, riderId,riderName,riderPhone, riderEmail });
      }
    });
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
                    <td colSpan="4" className="text-center">
                      No matching riders found
                    </td>
                  </tr>
                ) : (
                  riders?.map((rider) => (
                    <tr key={rider._id}>
                      <td>{rider.name}</td>
                      <td>{rider.phone}</td>
                      <td>{rider.district}</td>
                      <td>
                        <button
                          onClick={() => handleAssign(rider?._id, rider?.name, rider.phone, rider.email)}
                          className="btn btn-sm btn-primary text-black"
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
          <button onClick={onClose} className="btn">
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default AssignRiderModal;

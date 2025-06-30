import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import useAxiosSecure from './../../../Hooks/useAxiosSecure';
import { toast } from "react-toastify";
import Swal from "sweetalert2";


const PendingRiders = () => {
    const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);

  const {data: riders = [], isLoading, refetch,} = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async()=>{
        const res = await axiosSecure.get("/riders/pending");
        return res.data;
    }
  });

    const handleAction = async (id, status) => {
    const result = await Swal.fire({
        title: `Are you sure?`,
        text: `You are about to ${status} this rider.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: status === 'approved' ? '#3085d6' : '#d33',
        cancelButtonColor: '#aaa',
        confirmButtonText: `Yes, ${status} it!`,
    });

    if (result.isConfirmed) {
        try {
        await axiosSecure.patch(`/riders/status/${id}`, {
            status,
        });
        Swal.fire('Updated!', `Rider has been ${status}.`, 'success');
        refetch();
        } catch (err) {
        Swal.fire('Error', 'Something went wrong.', 'error');
        console.error(err);
        }
    }
    };

  if (isLoading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Pending Riders</h2>

      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>District</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td className="space-x-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setSelectedRider(rider)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleAction(rider._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleAction(rider._id, "canceled")}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for full details */}
      {selectedRider && (
        <dialog id="riderModal" className="modal modal-open">
          <div className="modal-box max-w-xl">
            <h3 className="font-bold text-lg">Rider Details</h3>
            <div className="py-4 space-y-2">
              <p>
                <strong>Name:</strong> {selectedRider.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedRider.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedRider.phone}
              </p>
              <p>
                <strong>NID:</strong> {selectedRider.nid}
              </p>
              <p>
                <strong>Bike Brand:</strong> {selectedRider.bikeBrand}
              </p>
              <p>
                <strong>Reg No:</strong> {selectedRider.bikeRegNo}
              </p>
              <p>
                <strong>Region:</strong> {selectedRider.region}
              </p>
              <p>
                <strong>District:</strong> {selectedRider.district}
              </p>
              <p>
                <strong>Status:</strong> {selectedRider.status}
              </p>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedRider(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingRiders;

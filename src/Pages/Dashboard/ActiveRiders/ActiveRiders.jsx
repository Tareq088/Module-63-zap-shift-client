import { useState } from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ActiveRiders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch approved riders
  const { data: riders = [], refetch } = useQuery({
    queryKey: ["approvedRiders"],
    queryFn: async () => {const res = await axiosSecure.get("riders/approved?status=approved");
      return res.data;
    },
  });

  // ✅ Handle Deactivate action with confirmation
  const handleDeactivate = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to deactivate this rider.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Deactivate",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/riders/status/${id}`, {
          status: "deactivated",
        });
        Swal.fire("Deactivated!", "Rider has been deactivated.", "success");
        refetch();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Something went wrong.", "error");
      }
    }
  };

  // ✅ Filter by search term
  const filteredRiders = riders.filter(
    (rider) =>
      rider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Active Riders</h2>

      {/* 🔍 Search Box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or phone"
          className="input input-bordered w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Bike</th>
              <th>District</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.phone}</td>
                <td>{rider.bikeBrand}</td>
                <td>{rider.district}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleDeactivate(rider._id)}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
            {filteredRiders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  No riders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveRiders;

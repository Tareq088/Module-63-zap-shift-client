import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useState } from "react";
import AssignRiderModal from "./AssignRiderModal";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
   const [selectedParcel, setSelectedParcel] = useState(null);

  const { data: parcels = [], isLoading, refetch } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/parcels?payment_status=paid&delivery_status=not_collected"
      );
                // older data will come first
      return res.data.sort(
        (a, b) =>
          new Date(a.parcel.creation_date) - new Date(b.parcel.creation_date)
      );
    },
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString(); // Human-readable format
    // return date.toISOString(); // Optional ISO format
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Assign Rider to Parcels</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Cost</th>
                <th>Created At</th>
                <th>Paid At</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((item, index) => (
                <tr key={item.trackingId}>
                  <td>{index + 1}</td>
                  {/* ✅ Visible fields */}
                  <td>{item.trackingId}</td>
                  <td>৳{item.cost}</td>
                  <td>{formatDate(item.creation_date)}</td>
                  <td>{formatDate(item.paidAtTime)}</td>

                  {/* Sender info */}
                  <td>
                    <div>
                      <div className="font-semibold">{item.sender?.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.sender?.district}, {item.sender?.region}
                      </div>
                    </div>
                  </td>

                  {/* Receiver info */}
                  <td>
                    <div>
                      <div className="font-semibold">{item.receiver?.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.receiver?.district}, {item.receiver?.region}
                      </div>
                    </div>
                  </td>

                  <td>
                    {/* 👇 Placeholder action, you’ll add functionality later */}
                    <button 
                     onClick={() => setSelectedParcel(item)}
                    className="btn btn-sm btn-primary text-black text-base px-4 py-7">
                      Assign Rider
                    </button>
                    {selectedParcel && (
                        <AssignRiderModal
                            parcel={selectedParcel}
                            onClose={() => setSelectedParcel(null)}
                            refetch={refetch}
                        />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignRider;

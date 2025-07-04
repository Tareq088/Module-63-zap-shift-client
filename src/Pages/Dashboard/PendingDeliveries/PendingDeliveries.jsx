import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PendingDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch pending delivery parcels for this rider
  const {data: parcels = [],refetch,isLoading,} = useQuery({
    queryKey: ["pendingDeliveries", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/pending-deliveries?riderEmail=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // ✅ Mutation to update delivery_status
  const { mutate: updateDeliveryStatus } = useMutation({
    mutationFn: async ({ id, newStatus }) => {const res = await axiosSecure.patch(`/parcels/${id}/delivery-status`,{ newStatus });
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire("✅ Success", data.message, "success");
      refetch();
    },
    onError: () => {
      Swal.fire("❌ Error", "Failed to update delivery status", "error");
    },
  });

  // 🔘 Action handler
  const handleStatusChange = (id, currentStatus) => {
    const nextStatus =
      currentStatus === "riders-assigned" ? "in-transit" : "delivered";
    const confirmText =
      currentStatus === "riders-assigned"
        ? "Mark as Picked Up"
        : "Mark as Delivered";

    Swal.fire({
      title: `Are you sure?`,
      text: `This parcel will be marked as "${nextStatus}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: confirmText,
    }).then((result) => {
      if (result.isConfirmed) {
        updateDeliveryStatus({ id, newStatus: nextStatus });
      }
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">📦 Pending Deliveries</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Receiver</th>
              <th>Contact</th>
              <th>District</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((item) => (
              <tr key={item._id}>
                <td>{item.trackingId}</td>
                <td>{item.receiver?.name}</td>
                <td>{item.receiver?.contact}</td>
                <td>{item.receiver?.district}</td>
                <td>
                  <span
                    className={`badge ${
                      item.delivery_status === "in-transit"
                        ? "badge-warning"
                        : "badge-info"
                    }`}
                  >
                    {item.delivery_status}
                  </span>
                </td>
                <td>
                  {(item.delivery_status === "riders-assigned" ||
                    item.delivery_status === "in-transit") && (
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() =>
                        handleStatusChange(item._id, item.delivery_status)
                      }
                    >
                      {item.delivery_status === "riders-assigned"
                        ? "Mark as Picked Up"
                        : "Mark as Delivered"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {parcels.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No pending deliveries.
          </p>
        )}
      </div>
    </div>
  );
};

export default PendingDeliveries;

import { useMutation, useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // 🔥 Fetch completed deliveries
  const { data: parcels = [], isLoading, refetch } = useQuery({
    queryKey: ['completedDeliveries', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/completed-deliveries?riderEmail=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });
  // 🆕 Cashout Mutation
  const mutation = useMutation({mutationFn: async (parcelId) => {
      const res = await axiosSecure.patch(`/parcels/cashout/${parcelId}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire('✅ Success', 'Cashout completed', 'success');
      refetch(); // 🆕 Refresh data and earnings
    },
    onError: () => {
      Swal.fire('❌ Error', 'Failed to cash out', 'error');
    },
  });
  // 🆕 Handle Cashout Button Click
  const handleCashout = (parcelId) => {
    Swal.fire({
      title: 'Confirm Cashout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cash Out',
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(parcelId);
      }
    });
  };


        // 🔁 CHANGED: Exclude cashed-out parcels from earnings
  const calculateEarnings = (parcels) => {
    return parcels.reduce((total, parcel) => {
      const sameDistrict = parcel.sender?.district === parcel.receiver?.district;
      const rate = sameDistrict ? 0.8 : 0.3;
      const earning = parcel.cost * rate;
      return parcel.cashout ? total : total + earning; // 🆕 Skip if already cashed out
    }, 0);
  };


  const totalEarnings = calculateEarnings(parcels);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">Completed Deliveries</h2>
      {/* 💰 Show total earnings */}
      <div className="text-lg font-semibold text-green-600 mb-4">
        💰 Total Earnings: ৳{totalEarnings.toFixed(2)}
      </div>
      {/* 📦 Parcel Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Sender</th>
              <th>Cost</th>
              <th>Receiver</th>
              <th>🟩Earning</th> 
              <th>Status</th>
              <th>Cashout</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => {
              const sameDistrict =
                parcel.sender?.district === parcel.receiver?.district;
              const rate = sameDistrict ? 0.8 : 0.3;
              const earning = parcel.cost * rate;
              return (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td>{parcel.trackingId}</td>
                  <td>{parcel.parcel?.title || 'N/A'}</td>
                  <td>{parcel.parcel?.type || 'N/A'}</td>
                  <td>
                    {parcel.sender?.name}
                    <br />
                    {parcel.sender?.address}
                  </td>
                  <td>
                    {parcel.receiver?.name}
                    <br />
                    {parcel.receiver?.address}
                  </td>
                  <td>৳{parcel.cost}</td>
                  <td>৳{earning.toFixed(2)}</td>
                  <td>
                    <span className="badge badge-success capitalize">
                      {parcel.delivery_status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                                  {/* 🆕 Cashout Button Logic */}
                    {parcel.delivery_status === 'delivered' && !parcel.cashout ? (
                      <button
                        onClick={() => handleCashout(parcel._id)}
                        className="btn btn-sm btn-success whitespace-nowrap px-3 py-1 text-sm"
                      >
                        Cash Out
                      </button>
                    ) : parcel.cashout ? (
                      <span className="text-sm text-gray-400">Cashed</span>
                    ) : (
                      <span className="text-sm text-gray-400">Not eligible</span>
                    )}
                </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {parcels.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No completed deliveries found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedDeliveries;

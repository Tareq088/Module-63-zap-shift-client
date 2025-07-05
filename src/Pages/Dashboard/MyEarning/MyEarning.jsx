import { useQuery } from '@tanstack/react-query';
import {
  parseISO,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
} from 'date-fns';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const MyEarning = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ['completedDeliveries', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/completed-deliveries?riderEmail=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const today = new Date();


  const stats = parcels.reduce((acc, parcel) => {
      const sameDistrict = parcel.sender?.district === parcel.receiver?.district;
      const rate = sameDistrict ? 0.8 : 0.3;
      const earning = parcel.cost * rate;
      const date = parseISO(parcel?.deliveredAt);
        // console.log("deliveredAt", parcel.deliveredAt)

      acc.totalCost += parcel.cost;
      acc.totalEarning += earning;
      if (parcel.cashout) {
        acc.totalCashOut += earning;
      } else {
        acc.totalPending += earning;
      }

      if (isSameDay(date, today)) acc.today += earning;
      if (isSameWeek(date, today)) acc.week += earning;
      if (isSameMonth(date, today)) acc.month += earning;
      if (isSameYear(date, today)) acc.year += earning;

      return acc;
    },
    {
      totalCost: 0,
      totalEarning: 0,
      totalCashOut: 0,
      totalPending: 0,
      today: 0,
      week: 0,
      month: 0,
      year: 0,
    }
  );

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-4">📊 My Earnings</h2>

      {/* 🔢 Summary Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow p-4">
          <h4 className="text-lg font-semibold">Total Cost</h4>
          <p className="text-xl font-bold text-blue-600">৳{stats.totalCost.toFixed(2)}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <h4 className="text-lg font-semibold">Total Earning</h4>
          <p className="text-xl font-bold text-green-600">৳{stats.totalEarning.toFixed(2)}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <h4 className="text-lg font-semibold">Total Cashed Out</h4>
          <p className="text-xl font-bold text-purple-600">৳{stats.totalCashOut.toFixed(2)}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <h4 className="text-lg font-semibold">Pending Cashout</h4>
          <p className="text-xl font-bold text-orange-600">৳{stats.totalPending.toFixed(2)}</p>
        </div>
      </div>

      {/* 📅 Breakdown Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-base-100 shadow p-4">
          <h4 className="text-lg font-semibold">Today</h4>
          <p className="text-xl font-bold text-primary">৳{stats.today.toFixed(2)}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <h4 className="text-lg font-semibold">This Week</h4>
          <p className="text-xl font-bold text-primary">৳{stats.week.toFixed(2)}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <h4 className="text-lg font-semibold">This Month</h4>
          <p className="text-xl font-bold text-primary">৳{stats.month.toFixed(2)}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <h4 className="text-lg font-semibold">This Year</h4>
          <p className="text-xl font-bold text-primary">৳{stats.year.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default MyEarning;

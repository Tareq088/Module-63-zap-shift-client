import React from "react";
import useAuth from "../../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: payments = [], isPending } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });
  console.log(payments);
  return (
    <div className="overflow-x-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>

      {payments.length === 0 ? (
        <div className="text-center text-gray-500 py-8 text-lg">
          No payment history found.
        </div>
      ) : (
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Parcel ID</th>
              <th>Amount (৳)</th>
              <th>Payment Method</th>
              <th>Transaction ID</th>
              <th>Paid At</th>
              <th>User Email</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id || index}>
                <td>{index + 1}</td>
                <td>{payment.parcelId}</td>
                <td className="font-semibold text-green-600">
                  ৳{payment.amount}
                </td>
                <td>{payment.payment_method?.join(", ")}</td>
                <td className="text-xs break-all">{payment.transaction_id}</td>
                <td>{new Date(payment.paidAtTime).toLocaleString()}</td>
                <td>{payment.created_by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;

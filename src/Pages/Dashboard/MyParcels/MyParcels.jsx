import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from './../../../Hooks/useAxiosSecure';
import { FaEye, FaTrash, FaMoneyBill } from 'react-icons/fa';

const MyParcels = () => {
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();
    const {data: parcels=[]} = useQuery({
        queryKey:['my-parcels', user.email],
        queryFn: async()=>{
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data
        }
    })
    console.log("parcel data asteche", parcels)
    return (
         <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Parcel Type</th>
                    <th>Created At</th>
                    <th>Cost (৳)</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {parcels?.map((parcel, index) => {
                    const isDocument = parcel?.parcel?.weight === undefined || parseFloat(parcel?.parcel?.weight) === 0;
                    const parcelType = isDocument ? 'Document' : 'Non-Document';

                    return (
                    <tr key={parcel._id}>
                        <th>{index + 1}</th>
                        <td>{parcelType}</td>
                        <td>{new Date(parcel.creation_date).toLocaleString()}</td>
                        <td>৳{parcel.cost}</td>
                        <td>
                        <span className={`badge px-4 py-1 text-white ${parcel.payment_status === 'paid' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {parcel.payment_status}
                        </span>
                        </td>
                        <td className="flex gap-2">
                        <button className="btn btn-xs btn-info">
                            <FaEye />
                        </button>
                        <button className="btn btn-xs btn-error" >
                            <FaTrash />
                        </button>
                        {parcel.payment_status === 'unpaid' && (
                            <button className="btn btn-xs btn-success" >
                            <FaMoneyBill />
                            </button>
                        )}
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default MyParcels;

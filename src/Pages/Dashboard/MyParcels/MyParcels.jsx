import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from './../../../Hooks/useAxiosSecure';
import { FaEye, FaTrash, FaMoneyBill } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router';

const MyParcels = () => {
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const {data: parcels=[], refetch} = useQuery({
        queryKey:['my-parcels', user.email],
        queryFn: async()=>{
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data
        }
    })

    const handleDeleteParcel = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This parcel will be permanently deleted!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    });

  if (result.isConfirmed) {
    try {
      const res = await axiosSecure.delete(`/parcels/${id}`);
      console.log(res.data);
      await refetch(); // 👈 this will refetch the parcels for the user
      if (res.data.deletedCount > 0) {
        Swal.fire('Deleted!', 'The parcel has been deleted.', 'success');
        // Optional: Refresh parcel list here if needed
      } else {
        Swal.fire('Error!', 'Parcel could not be deleted.', 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  }
    };
    const handlePay = async(id) =>{
        navigate(`/dashboard/payment/${id}`)
    }
    console.log("parcel data asteche", parcels)
    return (
         <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
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
                        <td className='max-w-[180px] truncate' title={parcel.parcel.title}>{parcel.parcel.title}</td>
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
                            <FaEye /> View
                        </button>
                        <button 
                            onClick={() => handleDeleteParcel(parcel._id)}
                            className="btn btn-xs btn-error" >
                            <FaTrash /> Delete
                        </button>
                        {parcel.payment_status === 'unpaid' && (
                            <button 
                            onClick={()=>handlePay(parcel._id)}
                            className="btn btn-xs btn-success" >
                            <FaMoneyBill /> pay
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

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "react-hot-toast";
import useAuth from "../../../Hooks/useAuth";
import useFetchJson from "../../../Hooks/useFetchJson";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const BeARider = () => {
  const { user } = useAuth();
  const { register, handleSubmit, watch, reset } = useForm();
  const [serviceCenter, setServiceCenter] = useState( [])
  const [selectedRegion, setSelectedRegion] = useState("");
  const axiosSecure = useAxiosSecure();
  const fetchPromise = useFetchJson();
//   console.log(fetchPromise)
    useEffect(() => {
    //   fetch("/warehouses.json")
    //     .then((res) => res.json())
        fetchPromise
        .then((data) => setServiceCenter(data))
        .catch((err) => console.error("Failed to load district data:", err));
    }, []);
    console.log(serviceCenter)

  const onSubmit = (data) => {
    const riderData = {
      ...data,
      status: "pending", // 🔒 default status
      name: user?.displayName,
      email: user?.email,
      created_at: new Date().toISOString(),
    };
    console.log(riderData);
    axiosSecure.post("/riders",riderData)
    .then(res=>{
        if(res.data.insertedId){
            console.log("rider submitted")
            toast.success("Rider registration submitted!");
        }
    })
    
    // reset();
  };

  // 🔄 Regions and filtered Districts
  const regions = [...new Set(serviceCenter.map((item) => item.region))];
  const districts = serviceCenter.filter((item) => item.region === selectedRegion).map((item) => item.district);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md my-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">
        Become a Rider
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name (read-only) */}
        <div>
          <label className="label font-medium">Name</label>
          <input
            type="text"
            defaultValue={user?.displayName}
            readOnly
            className="input input-bordered w-full font-bold"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="label font-medium">Email</label>
          <input
            type="email"
            defaultValue={user?.email}
            readOnly
            className="input input-bordered w-full font-bold"
          />
        </div>

        {/* Region dropdown */}
        <div>
          <label className="label font-medium">Region</label>
          <select
            className="select select-bordered w-full"
            {...register("region", { required: true })}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">Select Region</option>
            {regions.map((region, idx) => (
              <option key={idx} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* District dropdown */}
        <div>
          <label className="label font-medium">District</label>
          <select
            className="select select-bordered w-full"
            {...register("district", { required: true })}
          >
            <option value="">Select District</option>
            {districts.map((district, idx) => (
              <option key={idx} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Number */}
        <div>
          <label className="label font-medium">Phone Number</label>
          <input
            type="tel"
            placeholder="01XXXXXXXXX"
            {...register("phone", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        {/* NID */}
        <div>
          <label className="label font-medium">National ID Number</label>
          <input
            type="text"
            placeholder="Enter your NID"
            {...register("nid", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        {/* Bike Brand */}
        <div>
          <label className="label font-medium">Bike Brand</label>
          <input
            type="text"
            placeholder="Honda, Yamaha etc."
            {...register("bikeBrand", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        {/* Bike Registration Number */}
        <div>
          <label className="label font-medium">Bike Registration Number</label>
          <input
            type="text"
            placeholder="Example: DHAKA-XY-1234"
            {...register("bikeRegNo", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4">
          <button className="btn btn-primary text-black px-10 rounded-3xl">
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeARider;

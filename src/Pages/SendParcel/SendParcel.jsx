import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import axios from "axios";
import useFetchJson from "../../Hooks/useFetchJson";
import { useNavigate } from "react-router";
import useAddTrackingEvent from "../../Hooks/useAddTrackingEvent";
   // generate tracking Id
  const generateTrackingId = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase(); // e.g., "4F7Z1P"
  const timestamp = Date.now().toString().slice(-4); // last 4 digits of time
  return `TRK-${random}${timestamp}`; // e.g., "TRK-4F7Z1P8392"
};



const SendParcelForm = () => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const { control, handleSubmit, watch, reset, register } = useForm();
  const axiosSecure = useAxiosSecure();
  const [cost, setCost] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [breakdownCost, setBreakdownCost] = useState(" ");
  const fetchPromise = useFetchJson();
  const addTrackingEvent = useAddTrackingEvent();

  const [districtData, setDistrictData] = useState([]); // ✅ Add state for data
  // ✅ Fetch district data from public folder on mount
  useEffect(() => {
    // fetch("/warehouses.json")
    //   .then((res) => res.json())
    fetchPromise
      .then((data) => setDistrictData(data))
      .catch((err) => console.error("Failed to load district data:", err));
  }, [fetchPromise]);

  const [senderRegion, setSenderRegion] = useState("");
  const [senderDistrictState, setSenderDistrictState] = useState("");
  const [receiverRegion, setReceiverRegion] = useState("");
  const [receiverDistrictState, setReceiverDistrictState] = useState("");
  const [parcelType, setParcelType] = useState("");

  const weight = watch("parcel.weight");
  const senderDistrict = watch("sender.district");
  const receiverDistrict = watch("receiver.district");

  const uniqueRegions = [...new Set(districtData.map((item) => item.region))];
  const senderDistricts = districtData.filter((item) => item.region === senderRegion);
  const receiverDistricts = districtData.filter((item) => item.region === receiverRegion);
  const senderAreas = senderDistricts.find((d) => d.district === senderDistrictState)?.covered_area || [];
  const receiverAreas = receiverDistricts.find((d) => d.district === receiverDistrictState)?.covered_area || [];

  // Calculate cost based on new pricing policy
  useEffect(() => {
    if (!parcelType || !senderDistrict || !receiverDistrict) return;
    const isWithinCity = senderDistrict === receiverDistrict;
    let calculatedCost = 0;
    let breakdown = '';

    if (parcelType === "document") {
      calculatedCost = isWithinCity ? 60 : 80;
      breakdown = `Document (${isWithinCity ? 'Within City' : 'Outside City'}): ৳${calculatedCost}`;
    } 
    else if (parcelType === "non-document") {
      const w = parseFloat(weight) || 0;
      if (w <= 3) {
        calculatedCost = isWithinCity ? 110 : 150;
      } else {
        const base = isWithinCity ? 110 : 150;
        const extraWeight = w - 3;
        const extraCost = extraWeight * 40;
        calculatedCost = isWithinCity ? 110 + extraCost : 150 + extraCost + 40;
        breakdown = `Non-Document > 3kg (${weight}kg):\nBase: ৳${base} + Extra Weight (${extraWeight}kg × ৳40) = ৳${extraCost}${!isWithinCity ? ' + ৳40 (Outside City Extra)' : ''}\nTotal: ৳${calculatedCost}`;
      }
    }
    setCost(calculatedCost);
    setHasCalculated(true);
    setBreakdownCost(breakdown)
  }, [parcelType, weight, senderDistrict, receiverDistrict]);
               
  const onSubmit = async(data) => {
    // console.log(data);
      // Show SweetAlert with breakdown
  // const result = await Swal.fire({
  //   title: 'Confirm Parcel Submission',
  //   html: `<pre style="text-align:left">${breakdown}</pre>`,
  //   icon: 'info',
  //   showCancelButton: true,
  //   confirmButtonText: 'Confirm',
  //   cancelButtonText: 'Cancel'
  // });

    const parcelData = {...data, cost, 
      creation_date: new Date().toISOString(),
      created_by: user?.email,
      payment_status : "unpaid",
      delivery_status : "not_collected",
      trackingId: generateTrackingId(),
    }
    // console.log(parcelData);
    axiosSecure.post('/parcels',parcelData)
    .then(  async(data) => {
      console.log(data.data);
      if(data.data.insertedId){
          toast.success("Parcel info submitted!");
          reset();
          setCost(null);
          setHasCalculated(false);
                          // track parcel is created
          try {
                const trackingData = {
                  // parcelId: parcel._id,
                  trackingId: parcelData.trackingId,
                  status: 'Parcel_created',
                  details: `Parcel is created by ${user?.displayName}`,
                  updated_by: user.email,
                };

                await addTrackingEvent(trackingData);
                console.log('Tracking event successfully added');
              } catch (err) {
                console.error('Failed to post tracking event', err);
              }
            

          navigate("/dashboard/myParcels")
      }
    })
    .catch(error=>{
      console.log(error)
    })
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Send a Parcel</h2>
      <p className="mb-6 text-gray-600">
        Fill in the parcel, sender, and receiver details below.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Parcel Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Parcel Type</label>
            <div className="flex items-center gap-4 mt-1">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="document"
                  {...register("parcel.type")}
                  onChange={() => setParcelType("document")}
                />{" "}
                Document
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="non-document"
                  {...register("parcel.type")}
                  onChange={() => setParcelType("non-document")}
                />{" "}
                Non-Document
              </label>
            </div>
          </div>

          <div>
            <label className="font-semibold">Parcel Title</label>
            <input
              type="text"
              {...register("parcel.title")}
              className="input input-bordered w-full mt-1"
              placeholder="e.g. Official Papers"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-semibold">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              {...register("parcel.weight")}
              className="input input-bordered w-full mt-1"
              disabled={parcelType === "document"}
              placeholder="e.g. 1.5"
            />
          </div>
        </div>

        {/* Sender & Receiver */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sender Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Sender Info</h3>
            <input
              {...register("sender.name")}
              className="input input-bordered w-full mb-3"
              placeholder="Sender Name"
            />
            <input
              {...register("sender.contact")}
              className="input input-bordered w-full mb-3"
              placeholder="Contact Number"
            />

            <Controller
              name="sender.region"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="select select-bordered w-full mb-3"
                  onChange={(e) => {
                    field.onChange(e);
                    setSenderRegion(e.target.value);
                    setSenderDistrictState("");
                  }}
                >
                  <option value="">Select Region</option>
                  {uniqueRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              )}
            />

            <Controller
              name="sender.district"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="select select-bordered w-full mb-3"
                  onChange={(e) => {
                    field.onChange(e);
                    setSenderDistrictState(e.target.value);
                  }}
                  disabled={!senderRegion}
                >
                  <option value="">Select District</option>
                  {senderDistricts.map((d) => (
                    <option key={d.district} value={d.district}>
                      {d.district}
                    </option>
                  ))}
                </select>
              )}
            />

            <Controller
              name="sender.serviceCenter"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="select select-bordered w-full mb-3"
                  disabled={!senderDistrictState}
                >
                  <option value="">Select Service Center</option>
                  {senderAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              )}
            />

            <textarea
              {...register("sender.address")}
              className="textarea textarea-bordered w-full mb-3"
              placeholder="Sender Address"
            ></textarea>
            <textarea
              {...register("sender.instruction")}
              className="textarea textarea-bordered w-full"
              placeholder="Pickup Instruction"
            ></textarea>
          </div>

          {/* Receiver Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Receiver Info</h3>
            <input
              {...register("receiver.name")}
              className="input input-bordered w-full mb-3"
              placeholder="Receiver Name"
            />
            <input
              {...register("receiver.contact")}
              className="input input-bordered w-full mb-3"
              placeholder="Contact Number"
            />

            <Controller
              name="receiver.region"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="select select-bordered w-full mb-3"
                  onChange={(e) => {
                    field.onChange(e);
                    setReceiverRegion(e.target.value);
                    setReceiverDistrictState("");
                  }}
                >
                  <option value="">Select Region</option>
                  {uniqueRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              )}
            />

            <Controller
              name="receiver.district"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="select select-bordered w-full mb-3"
                  onChange={(e) => {
                    field.onChange(e);
                    setReceiverDistrictState(e.target.value);
                  }}
                  disabled={!receiverRegion}
                >
                  <option value="">Select District</option>
                  {receiverDistricts.map((d) => (
                    <option key={d.district} value={d.district}>
                      {d.district}
                    </option>
                  ))}
                </select>
              )}
            />

            <Controller
              name="receiver.serviceCenter"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="select select-bordered w-full mb-3"
                  disabled={!receiverDistrictState}
                >
                  <option value="">Select Service Center</option>
                  {receiverAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              )}
            />

            <textarea
              {...register("receiver.address")}
              className="textarea textarea-bordered w-full mb-3"
              placeholder="Receiver Address"
            ></textarea>
            <textarea
              {...register("receiver.instruction")}
              className="textarea textarea-bordered w-full"
              placeholder="Delivery Instruction"
            ></textarea>
          </div>
        </div>

        {/* Cost */}
        {hasCalculated && (
          <p className="text-xl font-bold text-green-600">
            Cost with Details: <span className="text-black">{breakdownCost}</span>
            <br />
            Total Cost: ৳{cost}
          </p>
        )}
        <button type="submit" className="btn btn-primary text-black mt-4">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SendParcelForm;

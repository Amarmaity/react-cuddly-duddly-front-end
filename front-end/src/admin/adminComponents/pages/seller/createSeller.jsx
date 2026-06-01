import React, { useState } from "react";
import Message from "../../../../components/messages";

const createSeller = () => {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const [fromData, setFromData] = useState({
    email: "",
    mobile: "",
    business_name: "",
    store_display_name: "",
    business_type: "",

    have_gst: "0",
    gst_number: "",

    pan: "",
    name_as_per_pan: "",

    city: "",
    state: "",
    dist: "",
    pin: "",

    room_building: "",
    street_landmark: "",

    pick_add_one: "",
    pick_add_two: "",
    pickup_pin: "",
    pickup_land_mark: "",
    pickup_city: "",
    pickup_state: "",

    contact_p_name: "",
    contact_number: "",

    account_holder_name: "",
    bank_name: "",
    ifsc_code: "",
    account_number: "",

    products_category: "",
    monthly_order: "",
    average_dispatch: "same_day",

    commission: "",
    seller_logo: "",
  });

  const validateFrom = () => {
    const errors = {};
    if (!fromData.email) {
      errors.email("Email is required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email";

      if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
        errors.mobile = "Invalid mobile number";
      }
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFrom();

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/register/seller/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setSuccess("Seller created successfully");
      setError("");
    } catch (error) {
      console.error("Error: ", error);
      setError("Failed to create seller. Please try again.");
    }
  };

  return (
    <div className="create-seller-body">
      <h1>Crate Seller</h1>
      <div>
        <from onSubmit={handleSubmit}>
          <div className="row-1">
            <label> Business Name</label>

            <input
              type="text"
              placeholder="Enter Business Name"
              name="business_name"
              value={fromData.business_name}
              onChange={(e) =>
                setFromData({ ...fromData, business_name: e.target.value })
              }
            />

            <label>Store Display Name</label>
            <input
              type="text"
              placeholder="Enter Store Display Name"
              name="store_display_name"
              value={fromData.store_display_name}
              onChange={(e) =>
                setFromData({ ...fromData, store_display_name: e.target.value })
              }
            />
          </div>

          <div className="row-2">
            <label> Business Type</label>
            <select
              name="business_type"
              value={fromData.business_type}
              onChange={(e) =>
                setFromData({ ...fromData, business_type: e.target.value })
              }
            >
              <option value="">Select Business Type</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>

            <label>GST</label>
            <select
              name="have_gst"
              value={fromData.have_gst}
              onChange={(e) =>
                setFromData({ ...fromData, have_gst: e.target.value })
              }
            >
              <option value="">Select GST</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>

          <div className="row-3">
            <label>GST Number</label>
            <input
              type="text"
              placeholder="Enter GST Number"
              name="gst_number"
              value={fromData.gst_number}
              onChange={(e) =>
                setFromData({ ...fromData, gst_number: e.target.value })
              }
            />

            <label> PAN Number</label>
            <input
              type="text"
              placeholder="Enter PAN Number"
              name="pan"
              value={fromData.pan}
              onChange={(e) =>
                setFromData({ ...fromData, pan: e.target.value })
              }
            />

            <label>Name as per PAN</label>
            <input
              type="text"
              placeholder="Enter Name as per PAN"
              name="name_as_per_pan"
              value={fromData.name_as_per_pan}
              onChange={(e) =>
                setFromData({ ...fromData, name_as_per_pan: e.target.value })
              }
            />
          </div>

          <div className="row-4">
            <label>City</label>
            <input
              type="text"
              placeholder="Enter City"
              name="city"
              value={fromData.city}
              onChange={(e) =>
                setFromData({ ...fromData, city: e.target.value })
              }
            />

            <label>State</label>
            <input
              type="text"
              placeholder="Enter State"
              name="state"
              value={fromData.state}
              onChange={(e) =>
                setFromData({ ...fromData, state: e.target.value })
              }
            />

            <label>District</label>
            <input
              type="text"
              placeholder="Enter District"
              name="dist"
              value={fromData.dist}
              onChange={(e) =>
                setFromData({ ...fromData, dist: e.target.value })
              }
            />

            <label>PIN Code</label>
            <input
              type="text"
              placeholder="Enter PIN Code"
              name="pin"
              value={fromData.pin}
              onChange={(e) =>
                setFromData({ ...fromData, pin: e.target.value })
              }
            />
          </div>

          <div className="row-5">
            <label>Pickup Address Line 1</label>
            <input
              type="text"
              placeholder="Enter Pickup Address Line 1"
              name="pick_add_one"
              value={fromData.pick_add_one}
              onChange={(e) =>
                setFromData({ ...fromData, pick_add_one: e.target.value })
              }
            />

            <label>Pickup Address Line 2</label>
            <input
              type="text"
              placeholder="Enter Pickup Address Line 2"
              name="pick_add_two"
              value={fromData.pick_add_two}
              onChange={(e) =>
                setFromData({ ...fromData, pick_add_two: e.target.value })
              }
            />

            <label>Pickup PIN Code</label>
            <input
              type="text"
              placeholder="Enter Pickup PIN Code"
              name="pickup_pin"
              value={fromData.pickup_pin}
              onChange={(e) =>
                setFromData({ ...fromData, pickup_pin: e.target.value })
              }
            />

            <label>Pickup Landmark</label>
            <input
              type="text"
              placeholder="Enter Pickup Landmark"
              name="pickup_land_mark"
              value={fromData.pickup_land_mark}
              onChange={(e) =>
                setFromData({ ...fromData, pickup_land_mark: e.target.value })
              }
            />

            <label>Pickup City</label>
            <input
              type="text"
              placeholder="Enter Pickup City"
              name="pickup_city"
              value={fromData.pickup_city}
              onChange={(e) =>
                setFromData({ ...fromData, pickup_city: e.target.value })
              }
            />

            <label>Pickup State</label>
            <input
              type="text"
              placeholder="Enter Pickup State"
              name="pickup_state"
              value={fromData.pickup_state}
              onChange={(e) =>
                setFromData({ ...fromData, pickup_state: e.target.value })
              }
            />
          </div>

          <div className="row-6">
            <label>Contact Person Name</label>
            <input
              type="text"
              placeholder="Enter Contact Person Name"
              name="contact_p_name"
              value={fromData.contact_p_name}
              onChange={(e) =>
                setFromData({ ...fromData, contact_p_name: e.target.value })
              }
            />

            <label>Contact Number</label>
            <input
              type="text"
              placeholder="Enter Contact Number"
              name="contact_number"
              value={fromData.contact_number}
              onChange={(e) =>
                setFromData({ ...fromData, contact_number: e.target.value })
              }
            />
          </div>

          <div className="row-7">
            <label>Product Category</label>
            <select
              name="product_category"
              value={fromData.product_category}
              onChange={(e) =>
                setFromData({ ...fromData, product_category: e.target.value })
              }
            >
              <option value="">Select Product Category</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>

            <label>Monthly Order</label>
            <select
              name="monthly_order"
              value={fromData.monthly_order}
              onChange={(e) =>
                setFromData({ ...fromData, monthly_order: e.target.value })
              }
            >
              <option value="">Select Monthly Order</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>

            <label>Average Dispatch</label>
            <select
              name="average_dispatch"
              value={fromData.average_dispatch}
              onChange={(e) =>
                setFromData({ ...fromData, average_dispatch: e.target.value })
              }
            >
              <option value="">Select Average Dispatch</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>

            <label>Commission</label>
            <input
              type="text"
              placeholder="Enter Commission"
              name="commission"
              value={fromData.commission}
              onChange={(e) =>
                setFromData({ ...fromData, commission: e.target.value })
              }
            />
          </div>
          <button className="create-seller-button">Create Seller</button>
          <button className="create-seller-button">Cancel</button>
        </from>
        <Message type="error" message={error} clearMessage={setError} />
        <Message type="success" message={success} clearMessage={setSuccess} />
      </div>
    </div>
  );
};

export default createSeller;

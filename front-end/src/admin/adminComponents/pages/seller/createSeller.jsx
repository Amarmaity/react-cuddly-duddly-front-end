import React, { useState } from "react";

const createSeller = () => {
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

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
  };

  return (
    <div>
      <h1>Crate Seller</h1>
    </div>
  );
};

export default createSeller;

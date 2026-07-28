import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Message from "../../../../components/messages";
import { adminApiRequest } from "../../utils/adminApi";
import "./seller.css";

const initialFormData = {
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
  password: "",
  confirm_password: "",
};

const textSections = [
  {
    title: "Account",
    fields: [
      { name: "email", label: "Email", type: "email", autoComplete: "email" },
      { name: "mobile", label: "Mobile", inputMode: "numeric", autoComplete: "tel", maxLength: 10 },
    ],
  },
  {
    title: "Business Details",
    fields: [
      { name: "business_name", label: "Business Name" },
      { name: "store_display_name", label: "Store Display Name" },
      { name: "pan", label: "PAN Number", transform: "upper", maxLength: 10 },
      { name: "name_as_per_pan", label: "Name as per PAN" },
    ],
  },
  {
    title: "Registered Address",
    fields: [
      { name: "room_building", label: "Room / Building" },
      { name: "street_landmark", label: "Street / Landmark" },
      { name: "city", label: "City" },
      { name: "state", label: "State" },
      { name: "dist", label: "District" },
      { name: "pin", label: "PIN Code", inputMode: "numeric", maxLength: 6 },
    ],
  },
  {
    title: "Pickup Address",
    fields: [
      { name: "pick_add_one", label: "Address Line 1" },
      { name: "pick_add_two", label: "Address Line 2" },
      { name: "pickup_land_mark", label: "Landmark" },
      { name: "pickup_city", label: "City" },
      { name: "pickup_state", label: "State" },
      { name: "pickup_pin", label: "PIN Code", inputMode: "numeric", maxLength: 6 },
    ],
  },
  {
    title: "Contact",
    fields: [
      { name: "contact_p_name", label: "Contact Person Name" },
      { name: "contact_number", label: "Contact Number", inputMode: "numeric", maxLength: 10 },
    ],
  },
  {
    title: "Bank Details",
    fields: [
      { name: "account_holder_name", label: "Account Holder Name" },
      { name: "bank_name", label: "Bank Name" },
      { name: "ifsc_code", label: "IFSC Code", transform: "upper", maxLength: 11 },
      { name: "account_number", label: "Account Number", inputMode: "numeric", maxLength: 30 },
    ],
  },
  {
    title: "Login Details",
    fields: [
      { name: "password", label: "Password", type: "password" },
      { name: "confirm_password", label: "Confirm Password", type: "password" },
    ],
  },
];

const selectFields = [
  {
    name: "business_type",
    label: "Business Type",
    options: [
      ["individual", "Individual"],
      ["proprietorship", "Proprietorship"],
      ["partnership", "Partnership"],
      ["company", "Company"],
    ],
  },
  {
    name: "have_gst",
    label: "GST Registered",
    options: [
      ["1", "Yes"],
      ["0", "No"],
    ],
  },
  {
    name: "products_category",
    label: "Product Category",
    options: [
      ["fashion", "Fashion"],
      ["electronics", "Electronics"],
      ["beauty", "Beauty"],
      ["other", "Other"],
    ],
  },
  {
    name: "monthly_order",
    label: "Monthly Orders",
    options: [
      ["0-100", "0-100"],
      ["100-500", "100-500"],
      ["500+", "500+"],
    ],
  },
  {
    name: "average_dispatch",
    label: "Average Dispatch",
    options: [
      ["same_day", "Same Day"],
      ["1_day", "1 Day"],
      ["2_day", "2 Days"],
    ],
  },
];

const formatBackendError = (data) => {
  if (!data) return "Failed to create seller. Please try again.";
  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (typeof data.detail === "string") return data.detail;
  return "Please fix the highlighted fields and try again.";
};

const getBackendFieldErrors = (data) => {
  const source = data?.message && typeof data.message === "object" ? data.message : data;

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return {};
  }

  return Object.entries(source).reduce((errors, [field, value]) => {
    if (field === "success" || field === "data") return errors;
    errors[field] = Array.isArray(value) ? value.join(" ") : String(value);
    return errors;
  }, {});
};

const CreateSeller = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleTextSections = useMemo(() => {
    const gstField = {
      name: "gst_number",
      label: "GST Number",
      transform: "upper",
      maxLength: 15,
      disabled: formData.have_gst !== "1",
    };

    return textSections.map((section) =>
      section.title === "Business Details"
        ? { ...section, fields: [...section.fields.slice(0, 2), gstField, ...section.fields.slice(2)] }
        : section,
    );
  }, [formData.have_gst]);

  const updateField = (name, value, transform) => {
    const nextValue = transform === "upper" ? value.toUpperCase() : value;

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
      ...(name === "have_gst" && value !== "1" ? { gst_number: "" } : {}),
    }));

    setFieldErrors((current) => {
      if (!current[name] && !(name === "have_gst" && current.gst_number)) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[name];
      if (name === "have_gst") delete nextErrors.gst_number;
      return nextErrors;
    });
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]{3}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    const pinRegex = /^[1-9][0-9]{5}$/;
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

    const trimmed = Object.entries(formData).reduce((values, [key, value]) => {
      values[key] = typeof value === "string" ? value.trim() : value;
      return values;
    }, {});

    if (!trimmed.email) errors.email = "Email is required";
    else if (!emailRegex.test(trimmed.email)) errors.email = "Enter a valid email address";

    if (!trimmed.mobile) errors.mobile = "Mobile number is required";
    else if (!phoneRegex.test(trimmed.mobile)) errors.mobile = "Enter a valid 10 digit mobile number";

    if (!trimmed.business_name) errors.business_name = "Business name is required";
    if (!trimmed.store_display_name) errors.store_display_name = "Store display name is required";
    if (!trimmed.business_type) errors.business_type = "Business type is required";

    if (trimmed.have_gst === "1") {
      if (!trimmed.gst_number) errors.gst_number = "GST number is required";
      else if (!gstRegex.test(trimmed.gst_number)) errors.gst_number = "Enter a valid GST number";
    }

    if (!trimmed.pan) errors.pan = "PAN number is required";
    else if (!panRegex.test(trimmed.pan)) errors.pan = "Enter a valid PAN number";

    if (!trimmed.name_as_per_pan) errors.name_as_per_pan = "Name as per PAN is required";
    if (!trimmed.city) errors.city = "City is required";
    if (!trimmed.state) errors.state = "State is required";
    if (!trimmed.dist) errors.dist = "District is required";

    if (!trimmed.pin) errors.pin = "PIN code is required";
    else if (!pinRegex.test(trimmed.pin)) errors.pin = "Enter a valid 6 digit PIN code";

    if (!trimmed.pick_add_one) errors.pick_add_one = "Pickup address line 1 is required";

    if (!trimmed.pickup_pin) errors.pickup_pin = "Pickup PIN code is required";
    else if (!pinRegex.test(trimmed.pickup_pin)) errors.pickup_pin = "Enter a valid pickup PIN code";

    if (!trimmed.pickup_city) errors.pickup_city = "Pickup city is required";
    if (!trimmed.pickup_state) errors.pickup_state = "Pickup state is required";
    if (!trimmed.contact_p_name) errors.contact_p_name = "Contact person name is required";

    if (!trimmed.contact_number) errors.contact_number = "Contact number is required";
    else if (!phoneRegex.test(trimmed.contact_number)) errors.contact_number = "Enter a valid contact number";

    if (trimmed.ifsc_code && !ifscRegex.test(trimmed.ifsc_code)) {
      errors.ifsc_code = "Enter a valid IFSC code";
    }

    if (!trimmed.products_category) errors.products_category = "Product category is required";
    if (!trimmed.monthly_order) errors.monthly_order = "Monthly order range is required";
    if (!trimmed.average_dispatch) errors.average_dispatch = "Average dispatch time is required";

    if (
      trimmed.commission !== "" &&
      (Number.isNaN(Number(trimmed.commission)) ||
        Number(trimmed.commission) < 0 ||
        Number(trimmed.commission) > 100)
    ) {
      errors.commission = "Commission must be between 0 and 100";
    }

    if (!trimmed.password) errors.password = "Password is required";
    if (!trimmed.confirm_password) errors.confirm_password = "Confirm password is required";
    if (trimmed.password && trimmed.confirm_password && trimmed.password !== trimmed.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }

    return errors;
  };

  const buildPayload = () =>
    Object.entries(formData).reduce((payload, [key, value]) => {
      if (key === "confirm_password") {
        return payload;
      }

      const nextValue = typeof value === "string" ? value.trim() : value;
      if (nextValue !== "") {
        payload[key] = nextValue;
      }

      return payload;
    }, {});

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await adminApiRequest({
        method: "post",
        url: "/api/admin/admin-crearte-get-seller/",
        data: buildPayload(),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setFormData(initialFormData);
      setFieldErrors({});
      setSuccess("Seller created successfully.");
    } catch (requestError) {
      const responseData = requestError.response?.data;
      const backendErrors = getBackendFieldErrors(responseData);

      setFieldErrors(backendErrors);
      setError(formatBackendError(responseData));

      if (requestError.response?.status === 401 || requestError.response?.status === 403) {
        setError("You are not authorized to create sellers. Please login as an admin.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldError = (name) =>
    fieldErrors[name] ? <span className="error-message">{fieldErrors[name]}</span> : null;

  return (
    <div className="create-seller-body">
      <div className="create-seller-header">
        <h1>Create Seller</h1>
        <button type="button" className="create-seller-secondary-button" onClick={() => navigate("/admin-dashboard/seller")}>
          Back to Sellers
        </button>
      </div>

      <form className="create-seller-form" onSubmit={handleSubmit} noValidate>
        {visibleTextSections.map((section) => (
          <fieldset className="create-seller-section" key={section.title}>
            <legend>{section.title}</legend>

            <div className="create-seller-grid">
              {section.fields.map((field) => (
                <div className="create-seller-field" key={field.name}>
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type || "text"}
                    value={formData[field.name] || ""}
                    placeholder={`Enter ${field.label}`}
                    autoComplete={field.autoComplete || "off"}
                    inputMode={field.inputMode}
                    maxLength={field.maxLength}
                    disabled={field.disabled}
                    onChange={(event) => updateField(field.name, event.target.value, field.transform)}
                  />
                  {renderFieldError(field.name)}
                </div>
              ))}
            </div>
          </fieldset>
        ))}

        <fieldset className="create-seller-section">
          <legend>Operations</legend>

          <div className="create-seller-grid">
            {selectFields.map((field) => (
              <div className="create-seller-field" key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={(event) => updateField(field.name, event.target.value)}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map(([value, label]) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {renderFieldError(field.name)}
              </div>
            ))}

            <div className="create-seller-field">
              <label htmlFor="commission">Commission (%)</label>
              <input
                id="commission"
                name="commission"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.commission}
                placeholder="Enter Commission"
                onChange={(event) => updateField("commission", event.target.value)}
              />
              {renderFieldError("commission")}
            </div>
          </div>
        </fieldset>

        <div className="form-btn-area">
          <button
            type="button"
            className="create-seller-secondary-button"
            disabled={isSubmitting}
            onClick={() => navigate("/admin-dashboard/seller")}
          >
            Cancel
          </button>
          <button className="create-seller-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Seller"}
          </button>
        </div>
      </form>

      <Message type="error" message={error} clearMessage={setError} />
      <Message type="success" message={success} clearMessage={setSuccess} />
    </div>
  );
};

export default CreateSeller;

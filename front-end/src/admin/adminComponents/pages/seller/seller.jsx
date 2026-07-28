import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerSvg from "../../../../assets/seller.webp";
import Message from "../../../../components/messages";
import { adminApiRequest } from "../../utils/adminApi";
import "./seller.css";

const getSellerName = (seller) =>
  seller.store_display_name || seller.business_name || seller.contact_p_name || "Unnamed Seller";

const formatRequestError = (requestError, fallbackMessage) => {
  const responseData = requestError.response?.data;

  if (typeof responseData === "string") return responseData;
  if (typeof responseData?.message === "string") return responseData.message;
  if (typeof responseData?.detail === "string") return responseData.detail;
  if (requestError.message) return requestError.message;

  return fallbackMessage;
};

const Seller = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sellers");
  const [sellers, setSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updatingSellerId, setUpdatingSellerId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSellers = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await adminApiRequest({
        method: "get",
        url: "/api/admin/admin-crearte-get-seller/",
      });

      setSellers(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (requestError) {
      if (requestError.response?.status === 401 || requestError.response?.status === 403) {
        setError("You are not authorized to view sellers. Please login as an admin.");
      } else {
        setError(formatRequestError(requestError, "Unable to load sellers. Please try again."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSellers();
  }, []);

  const handleToggleActivation = async (seller) => {
    const nextStatus = !seller.is_active;
    setUpdatingSellerId(seller.id);
    setError("");
    setSuccess("");

    try {
      const response = await adminApiRequest({
        method: "patch",
        url: `/api/admin/admin-sellers/${seller.id}/status/`,
        data: { is_active: nextStatus },
        headers: {
          "Content-Type": "application/json",
        },
      });

      const updatedSeller = response.data?.data;

      setSellers((currentSellers) =>
        currentSellers.map((currentSeller) =>
          currentSeller.id === seller.id
            ? { ...currentSeller, ...updatedSeller, is_active: nextStatus }
            : currentSeller,
        ),
      );
      setSuccess(nextStatus ? "Seller activated successfully." : "Seller deactivated successfully.");
    } catch (requestError) {
      if (requestError.response?.status === 401 || requestError.response?.status === 403) {
        setError("You are not authorized to update seller status. Please login as an admin.");
      } else {
        setError(formatRequestError(requestError, "Unable to update seller status. Please try again."));
      }
    } finally {
      setUpdatingSellerId(null);
    }
  };

  const filteredSellers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return sellers;

    return sellers.filter((seller) => {
      const searchable = [
        seller.id,
        seller.business_name,
        seller.store_display_name,
        seller.contact_p_name,
        seller.contact_number,
        seller.user?.email,
        seller.user?.mobile,
        seller.city,
        seller.state,
        seller.products_category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(term);
    });
  }, [searchTerm, sellers]);

  return (
    <div>
      <div className="seller-heading">
        <img className="seller-svg" src={SellerSvg} alt="" />
        <h1>Sellers</h1>

        <button className="seller-create" onClick={() => navigate("/admin-dashboard/seller/create")}>
          Create Seller
        </button>
      </div>

      <div className="seller-body">
        <div className="seller-tab-area">
          <button
            type="button"
            className={`seller-tab ${activeTab === "sellers" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("sellers")}
          >
            All Sellers
          </button>
          <button
            type="button"
            className={`payout-tab ${activeTab === "payouts" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("payouts")}
          >
            Payouts
          </button>
        </div>

        {activeTab === "sellers" && (
          <div className="seller-content">
            <div className="seller-list-toolbar">
              <input
                type="search"
                placeholder="Search seller"
                className="seller-search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <button type="button" className="seller-refresh" onClick={fetchSellers} disabled={isLoading}>
                {isLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <div className="seller-table-wrap">
              <table className="seller-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Commission</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan="9" className="seller-table-state">
                        Loading sellers...
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    filteredSellers.map((seller) => (
                      <tr key={seller.id}>
                        <td>#{seller.id}</td>
                        <td>
                          <div className="seller-name-cell">
                            <strong>{getSellerName(seller)}</strong>
                            <span>{seller.business_name || "No business name"}</span>
                          </div>
                        </td>
                        <td>{seller.user?.email || "-"}</td>
                        <td>{seller.user?.mobile || seller.contact_number || "-"}</td>
                        <td>{seller.products_category || "-"}</td>
                        <td>{[seller.city, seller.state].filter(Boolean).join(", ") || "-"}</td>
                        <td>{seller.commission ? `${seller.commission}%` : "0%"}</td>
                        <td>
                          <span className={seller.is_active ? "status-active" : "status-inactive"}>
                            {seller.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="seller-action-cell">
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => navigate(`/admin-dashboard/seller/${seller.id}/edit`)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => navigate(`/admin-dashboard/seller/${seller.id}/delete`)}
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            className={seller.is_active ? "action-btn action-btn-warning" : "action-btn action-btn-success"}
                            disabled={updatingSellerId === seller.id}
                            onClick={() => handleToggleActivation(seller)}
                          >
                            {updatingSellerId === seller.id
                              ? "Updating..."
                              : seller.is_active
                                ? "Deactivate"
                                : "Activate"}
                          </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {!isLoading && filteredSellers.length === 0 && (
                    <tr>
                      <td colSpan="9" className="seller-table-state">
                        {searchTerm ? "No sellers match your search." : "No sellers found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "payouts" && (
          <div className="seller-content">
            <p className="seller-empty-note">Payout information is not available yet.</p>
          </div>
        )}
      </div>

      <Message type="error" message={error} clearMessage={setError} />
      <Message type="success" message={success} clearMessage={setSuccess} />
    </div>
  );
};

export default Seller;

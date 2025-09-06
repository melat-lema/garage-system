import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LayOut from "../../components/LayOut";
import AdminPanel from "./AdminPanel";
import customerService from "../../../services/customer.service";
import vehicleService from "../../../services/vehicle.service"; // ✅ Import vehicle service
import { useAuth } from "../../../Context/authContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employee } = useAuth();

  const [activeTab, setActiveTab] = useState("info");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vehicle modal state
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    vehicle_year: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_type: "",
    vehicle_mileage: "",
    vehicle_tag: "",
    vehicle_serial: "",
    vehicle_color: "",
  });

  // ✅ State for vehicles
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const token = employee?.employee_token;

  // Fetch customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await customerService.getCustomers(token);
        const cust = data.customers.find(c => c.customer_id === parseInt(id));
        if (!cust) throw new Error("Customer not found");
        setCustomer(cust);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchCustomer();
    }
  }, [id, token]);

  // ✅ Fetch vehicles for this customer
  const fetchVehicles = async () => {
    if (!customer?.customer_id || !token) return;

    setLoadingVehicles(true);
    try {
      const data = await vehicleService.getVehicles(customer.customer_id, token);
      if (data.vehicles && Array.isArray(data.vehicles)) {
        setVehicles(data.vehicles);
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
      toast.error("❌ Failed to load vehicles");
      setVehicles([]);
    } finally {
      setLoadingVehicles(false);
    }
  };

  // Load vehicles when switching to "Cars" tab
  useEffect(() => {
    if (activeTab === "cars" && customer?.customer_id) {
      fetchVehicles();
    }
  }, [activeTab, customer?.customer_id, token]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Open vehicle modal
  const openVehicleModal = () => {
    setShowVehicleModal(true);
  };

  // Close vehicle modal
  const closeVehicleModal = () => {
    setShowVehicleModal(false);
    setVehicleData({
      vehicle_year: "",
      vehicle_make: "",
      vehicle_model: "",
      vehicle_type: "",
      vehicle_mileage: "",
      vehicle_tag: "",
      vehicle_serial: "",
      vehicle_color: "",
    });
  };

  // Handle input change
  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit vehicle form
  const handleSubmitVehicle = async (e) => {
    e.preventDefault();
    try {
      if (!vehicleData.vehicle_year || !vehicleData.vehicle_make || !vehicleData.vehicle_model) {
        toast.error("Year, Make, and Model are required");
        return;
      }

      // ✅ Send to backend
      await vehicleService.createVehicle(customer.customer_id, vehicleData, token);
      toast.success("✅ Vehicle added successfully!");

      // ✅ Refresh vehicle list
      await fetchVehicles();

      // ✅ Close modal
      closeVehicleModal();

    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  // Edit customer info
  const handleEdit = () => {
    navigate(`/admin/customers/edit/${id}`);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  return (
    <LayOut>
      <div className="flex min-h-screen bg-gray-100">
        <AdminPanel />
        <main className="flex-1 p-10 pl-40">
          {/* Header */}
          <h1 className="text-2xl font-bold text-blue-900 mb-8 relative inline-block">
            Customer: {customer.customer_first_name} {customer.customer_last_name}
            <span className="block w-8 h-0.5 bg-red-500 mt-1" />
          </h1>

          {/* Tabs */}
          <div className="flex items-start">
            {/* Sidebar Tabs */}
            <div className="w-16 flex-shrink-0">
              <div className="flex flex-col space-y-6">
                <button
                  onClick={() => handleTabChange("info")}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition ${
                    activeTab === "info" ? "bg-red-600" : "bg-gray-200"
                  }`}
                >
                  Info
                </button>
                <button
                  onClick={() => handleTabChange("cars")}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition ${
                    activeTab === "cars" ? "bg-red-600" : "bg-gray-200"
                  }`}
                >
                  Cars
                </button>
                <button
                  onClick={() => handleTabChange("orders")}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition ${
                    activeTab === "orders" ? "bg-red-600" : "bg-gray-200"
                  }`}
                >
                  Orders
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="ml-16 flex-1">
              {/* Info Tab */}
              {activeTab === "info" && (
                <div className="space-y-4">
                  <div className="text-sm">
                    <p><strong>Email:</strong> {customer.customer_email}</p>
                    <p><strong>Phone Number:</strong> {customer.customer_phone_number}</p>
                    <p><strong>Active Customer:</strong> {customer.active_customer === 1 ? 'Yes' : 'No'}</p>
                    <button
                      onClick={handleEdit}
                      className="text-blue-600 hover:text-blue-900 text-sm flex items-center"
                    >
                      Edit customer info
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Cars Tab */}
              {activeTab === "cars" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-blue-900">Vehicles of {customer.customer_first_name}</h2>

                  {/* ✅ Display vehicles or loading */}
                  {loadingVehicles ? (
                    <p>Loading vehicles...</p>
                  ) : vehicles.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-500">No vehicle found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vehicles.map((v) => (
                        <div key={v.vehicle_id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h3 className="font-medium">{v.vehicle_year} {v.vehicle_make} {v.vehicle_model}</h3>
                          <p><strong>Type:</strong> {v.vehicle_type}</p>
                          <p><strong>Mileage:</strong> {v.vehicle_mileage}</p>
                          <p><strong>Tag:</strong> {v.vehicle_tag}</p>
                          <p><strong>Serial:</strong> {v.vehicle_serial}</p>
                          <p><strong>Color:</strong> {v.vehicle_color}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={openVehicleModal}
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                  >
                    ADD NEW VEHICLE
                  </button>

                  {/* Vehicle Modal */}
                  {showVehicleModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-blue-900 mb-6">
                            Add a new vehicle
                            <span className="block w-8 h-0.5 bg-red-500 mt-1" />
                          </h3>
                          <form onSubmit={handleSubmitVehicle} className="space-y-4">
                            <input
                              type="number"
                              placeholder="Vehicle year"
                              name="vehicle_year"
                              value={vehicleData.vehicle_year}
                              onChange={handleVehicleChange}
                              className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Vehicle make"
                              name="vehicle_make"
                              value={vehicleData.vehicle_make}
                              onChange={handleVehicleChange}
                              className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Vehicle model"
                              name="vehicle_model"
                              value={vehicleData.vehicle_model}
                              onChange={handleVehicleChange}
                              className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Vehicle type"
                              name="vehicle_type"
                              value={vehicleData.vehicle_type}
                              onChange={handleVehicleChange}
                              className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="number"
                              placeholder="Vehicle mileage"
                              name="vehicle_mileage"
                              value={vehicleData.vehicle_mileage}
                              onChange={handleVehicleChange}
                              className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Vehicle tag"
                              name="vehicle_tag"
                              value={vehicleData.vehicle_tag}
                              onChange={handleVehicleChange}
                              className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Vehicle serial"
                              name="vehicle_serial"
                              value={vehicleData.vehicle_serial}
                              onChange={handleVehicleChange}
                              className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Vehicle color"
                              name="vehicle_color"
                              value={vehicleData.vehicle_color}
                              onChange={handleVehicleChange}
                              className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <div className="flex space-x-4 pt-4">
                              <button
                                type="submit"
                                className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition"
                              >
                                ADD VEHICLE
                              </button>
                              <button
                                type="button"
                                onClick={closeVehicleModal}
                                className="bg-gray-300 text-gray-800 py-2 px-6 rounded hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-blue-900">Orders of {customer.customer_first_name}</h2>
                  <p className="text-gray-500">Orders will be displayed here</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </LayOut>
  );
}
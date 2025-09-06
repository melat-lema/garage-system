import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LayOut from "../../components/LayOut";
import AdminPanel from "./AdminPanel";
import customerService from "../../../services/customer.service";
import vehicleService from "../../../services/vehicle.service";
import commonService from "../../../services/service.service";
import { useAuth } from "../../../Context/authContext";
import { toast } from "react-toastify";
import orderService from "../../../services/order.service";


export default function NewOrder() {
  const { employee } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [additionalRequests, setAdditionalRequests] = useState("");
  const [price, setPrice] = useState("");

  // Fetch customers on search
  useEffect(() => {
    if (!employee || !search.trim()) {
      setCustomers([]);
      return;
    }

    const token = employee.employee_token;
    const fetchCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const data = await customerService.getCustomers(token);

        if (data.customers && Array.isArray(data.customers)) {
          const term = search.toLowerCase();
          const filtered = data.customers.filter(cust =>
            cust.customer_first_name.toLowerCase().includes(term) ||
            cust.customer_last_name.toLowerCase().includes(term) ||
            cust.customer_email.toLowerCase().includes(term) ||
            cust.customer_phone_number?.toString().includes(term)
          );
          setCustomers(filtered);
        } else {
          throw new Error(data.message || "Invalid customer list");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load customers");
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, [employee, search]);

  // Fetch vehicles when customer is selected
  useEffect(() => {
    if (!selectedCustomer || !employee) return;

    const token = employee.employee_token;
    const fetchVehicles = async () => {
      setLoadingVehicles(true);
      try {
        const data = await vehicleService.getVehicles(selectedCustomer.customer_id, token);
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

    fetchVehicles();
  }, [selectedCustomer, employee]);

  // Fetch services when vehicle is selected
  useEffect(() => {
    if (!selectedVehicle || !employee) return;

    const token = employee.employee_token;
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const data = await commonService.getServices(token);
        if (data.services && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
        toast.error("❌ Failed to load services");
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [selectedVehicle, employee]);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setStep(2);
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setStep(3);
  };

  const handleBack = () => {
    if (step === 3) {
      setSelectedVehicle(null);
      setStep(2);
    } else if (step === 2) {
      setSelectedCustomer(null);
      setStep(1);
    }
  };
const handleCreateOrder = async () => {
  if (!selectedCustomer || !selectedVehicle || selectedServices.length === 0) {
    toast.error("Please select a customer, vehicle, and at least one service");
    return;
  }

  const priceValue = parseFloat(price);
  if (isNaN(priceValue) || priceValue < 0) {
    toast.error("Please enter a valid price");
    return;
  }

  try {
    await orderService.createOrder(
      {
        customer_id: selectedCustomer.customer_id,
        vehicle_id: selectedVehicle.vehicle_id,
        services: selectedServices,
        additional_request: additionalRequests,
        order_total_price: priceValue,
        employee_id: employee.employee_id
      },
      employee.employee_token
    );

    toast.success("✅ Order created successfully!");
    setStep(1);
    setSelectedCustomer(null);
    setSelectedVehicle(null);
    setSelectedServices([]);
    setAdditionalRequests("");
    setPrice("");

  } catch (err) {
    console.error("Order error:", err);
    toast.error(`❌ ${err.message}`);
  }
};

  return (
    <LayOut>
      <div className="flex min-h-screen bg-gray-100">
        <AdminPanel />
        <main className="flex-1 p-10 pl-40">
          <h1 className="text-2xl font-bold text-blue-900 mb-8 relative inline-block">
            Create a new order
            <span className="block w-8 h-0.5 bg-red-500 mt-1" />
          </h1>

          {/* Step 1: Customer Search */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Search for a customer using first name, last name, email address or phone number"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Loading */}
              {loadingCustomers && <p className="text-gray-500">Loading customers...</p>}

              {/* No Results */}
              {!loadingCustomers && search.length > 0 && customers.length === 0 && (
                <p className="text-gray-500">No customers found</p>
              )}

              {/* Customer Table */}
              {!loadingCustomers && search.length > 0 && customers.length > 0 && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.map((c) => (
                        <tr key={c.customer_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.customer_first_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.customer_last_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.customer_email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.customer_phone_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleSelectCustomer(c)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Show "Add New Customer" only when not searching */}
              {search.length === 0 && (
                <button
                  onClick={() => navigate("/admin/customers/add")}
                  className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition"
                >
                  ADD NEW CUSTOMER
                </button>
              )}
            </div>
          )}

          {/* Step 2: Vehicle Selection */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-4">Customer Info</h2>
                <p><strong>Name:</strong> {selectedCustomer.customer_first_name} {selectedCustomer.customer_last_name}</p>
                <p><strong>Email:</strong> {selectedCustomer.customer_email}</p>
                <p><strong>Phone:</strong> {selectedCustomer.customer_phone_number}</p>
                <p><strong>Active:</strong> {selectedCustomer.active_customer === 1 ? 'Yes' : 'No'}</p>
                <button
                  onClick={() => navigate(`/admin/customers/edit/${selectedCustomer.customer_id}`)}
                  className="text-blue-600 hover:text-blue-900 flex items-center mt-2"
                >
                  Edit customer info
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleBack}
                  className="text-red-600 hover:text-red-900 text-sm flex items-center mt-4"
                >
                  ← Back
                </button>
              </div>

              {/* Vehicle Table */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-4">Choose a vehicle</h2>

                {loadingVehicles ? (
                  <p>Loading vehicles...</p>
                ) : vehicles.length === 0 ? (
                  <p className="text-gray-500">No vehicles found</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Choose</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vehicles.map((v) => (
                        <tr key={v.vehicle_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.vehicle_year}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.vehicle_make}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.vehicle_model}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.vehicle_tag}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.vehicle_serial}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.vehicle_color}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.vehicle_mileage}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleSelectVehicle(v)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                                           ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Select Services & Submit */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Customer & Vehicle Info */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-4">Order Summary</h2>

                <h3 className="font-bold text-lg text-gray-800 mb-2">Customer</h3>
                <p><strong>Name:</strong> {selectedCustomer.customer_first_name} {selectedCustomer.customer_last_name}</p>
                <p><strong>Email:</strong> {selectedCustomer.customer_email}</p>
                <p><strong>Phone:</strong> {selectedCustomer.customer_phone_number}</p>

                <h3 className="font-bold text-lg text-gray-800 mt-4 mb-2">Vehicle</h3>
                <p><strong>Year:</strong> {selectedVehicle.vehicle_year}</p>
                <p><strong>Make:</strong> {selectedVehicle.vehicle_make}</p>
                <p><strong>Model:</strong> {selectedVehicle.vehicle_model}</p>
                <p><strong>Color:</strong> {selectedVehicle.vehicle_color}</p>
                <p><strong>Mileage:</strong> {selectedVehicle.vehicle_mileage}</p>
                <p><strong>Tag:</strong> {selectedVehicle.vehicle_tag}</p>

                <button
                  onClick={() => setStep(2)}
                  className="text-blue-600 hover:text-blue-900 flex items-center mt-4"
                >
                  ← Change Vehicle
                </button>
              </div>

              {/* Services Selection */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-4">Select Services</h2>

                {loadingServices ? (
                  <p>Loading services...</p>
                ) : services.length === 0 ? (
                  <p className="text-gray-500">No services available</p>
                ) : (
                  <div className="space-y-3">
                    {services.map((s) => (
                      <label key={s.service_id} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={selectedServices.includes(s.service_id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedServices([...selectedServices, s.service_id]);
                            } else {
                              setSelectedServices(selectedServices.filter(id => id !== s.service_id));
                            }
                          }}
                        />
                        <div>
                          <strong>{s.service_name}</strong>
                          {s.service_description && <p className="text-sm text-gray-600">{s.service_description}</p>}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Requests & Price */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-4">Order Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requests</label>
                    <textarea
                      value={additionalRequests}
                      onChange={(e) => setAdditionalRequests(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Any special instructions or requests..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter total price"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-between pt-4">
                <button
                  onClick={handleBack}
                  className="text-red-600 hover:text-red-900"
                >
                  ← Back
                </button>
                <button
                  onClick={handleCreateOrder}
                  className="bg-red-600 text-white py-2 px-8 rounded hover:bg-red-700 transition"
                >
                  SUBMIT ORDER
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </LayOut>
  );
}
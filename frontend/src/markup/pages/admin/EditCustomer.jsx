import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LayOut from "../../components/LayOut";
import AdminPanel from "./AdminPanel";
import customerService from "../../../services/customer.service";
import { useAuth } from "../../../Context/authContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employee } = useAuth();

  const [formData, setFormData] = useState({
    customer_first_name: "",
    customer_last_name: "",
    customer_phone_number: "",
    active_customer: 1,
    
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = employee?.employee_token;

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await customerService.getCustomers(token);
        const cust = data.customers.find(c => c.customer_id === parseInt(id));
        if (!cust) throw new Error("Customer not found");

        setFormData({
          customer_first_name: cust.customer_first_name || "",
          customer_last_name: cust.customer_last_name || "",
          customer_phone: cust.customer_phone_number || "",
          active_customer: cust.active_customer || 1,
            customer_email: cust.customer_email || ""
        });
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customerService.updateCustomer(id, formData, token);
      toast.success("✅ Customer updated successfully!");
      navigate("/admin/customers");
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <LayOut>
      <div className="flex min-h-screen bg-gray-100">
        <AdminPanel />
        <main className="flex-1 p-10 pl-40">
          <h1 className="text-2xl font-bold text-blue-900 mb-8 relative inline-block">
            Edit: {formData.customer_first_name} {formData.customer_last_name}
            <span className="block w-8 h-0.5 bg-red-500 mt-1" />
          </h1>

          <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl">
            <p className="text-sm text-gray-600 mb-6">
              Customer email: <strong>{formData.customer_email}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name *</label>
                <input
                  type="text"
                  name="customer_first_name"
                  value={formData.customer_first_name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                <input
                  type="text"
                  name="customer_last_name"
                  value={formData.customer_last_name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="customer_phone"
                  value={formData.customer_phone_number}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>

              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  name="active_customer"
                  checked={formData.active_customer === 1}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <label className="ml-2 text-sm text-gray-700">Is active customer</label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition"
                >
                  UPDATE
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/customers")}
                  className="bg-gray-300 text-gray-800 py-2 px-6 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </LayOut>
  );
}
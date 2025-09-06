import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LayOut from "../../components/LayOut";
import AdminPanel from "./AdminPanel";
import orderService from "../../../services/order.service";
import { useAuth } from "../../../Context/authContext";
import { toast } from "react-toastify";

export default function OrderDetails() {
  const { id } = useParams(); // ✅ Use useParams
  const { employee } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = employee?.employee_token;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(id, token);
        if (data.order) {
          setOrder(data.order);
        } else {
          throw new Error("Order not found");
        }
      } catch (err) {
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchOrder();
    }
  }, [id, token]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    let color, text;

    switch (status) {
      case 0:
        text = "Received";
        color = "bg-gray-100 text-gray-800";
        break;
      case 1:
        text = "In progress";
        color = "bg-yellow-100 text-yellow-800";
        break;
      case 2:
        text = "Completed";
        color = "bg-green-100 text-green-800";
        break;
      default:
        text = "Unknown";
        color = "bg-blue-100 text-blue-800";
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {text}
      </span>
    );
  };

  // ✅ Fixed: Call backend and refresh
  const handleUpdateService = async (orderServiceId, newStatus) => {
    try {
      await orderService.updateServiceStatus(orderServiceId, newStatus, token);
      toast.success("✅ Service status updated!");

      // Refresh order
      const data = await orderService.getOrderById(id, token);
      setOrder(data.order);

    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  if (!order) return null;

  return (
    <LayOut>
      <div className="flex min-h-screen bg-gray-100">
        <AdminPanel />
        <main className="flex-1 p-10 pl-40">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-blue-900">
              {order.customer_first_name} {order.customer_last_name}
            </h1>
            <StatusBadge status={order.order_status} />
          </div>

          {/* Customer & Vehicle Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-md rounded-lg p-6 border-b-4 border-red-500">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Customer</p>
              <h3 className="font-bold text-lg text-blue-900">{order.customer_first_name} {order.customer_last_name}</h3>
              <p><strong>Email:</strong> {order.customer_email}</p>
              <p><strong>Phone:</strong> {order.customer_phone_number}</p>
              <p><strong>Active:</strong> {order.active_customer === 1 ? 'Yes' : 'No'}</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 border-b-4 border-red-500">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Car in Service</p>
              <h3 className="font-bold text-lg text-blue-900">{order.vehicle_make} {order.vehicle_model} ({order.vehicle_color})</h3>
              <p><strong>Vehicle tag:</strong> {order.vehicle_tag}</p>
              <p><strong>Vehicle year:</strong> {order.vehicle_year}</p>
              <p><strong>Vehicle mileage:</strong> {order.vehicle_mileage}</p>
            </div>
          </div>

          {/* Services List */}
          <div className="bg-white shadow-md rounded-lg p-6 border-b-4 border-red-500 mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Requested service</p>

            <div className="space-y-4">
              {order.services.map((service) => (
                <div key={service.order_service_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-blue-900">{service.service_name}</h4>
                      <p className="text-sm text-gray-600">{service.service_description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={service.service_completed} />
                      <select
                        value={service.service_completed}
                        onChange={(e) => handleUpdateService(service.order_service_id, parseInt(e.target.value))}
                        className="ml-2 border border-gray-300 rounded p-1 text-sm"
                      >
                        <option value={0}>Received</option>
                        <option value={1}>In progress</option>
                        <option value={2}>Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

            {order.additional_request && (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-bold text-blue-900">Additional request</h4>
        <p className="text-sm text-gray-600">{order.additional_request}</p>
      </div>
      <StatusBadge status={order.additional_requests_completed} />
    </div>
  </div>
)}
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-end">
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
            >
              ← Back
            </button>
          </div>
        </main>
      </div>
    </LayOut>
  );
}
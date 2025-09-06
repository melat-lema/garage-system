import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LayOut from "../../components/LayOut";
import AdminPanel from "./AdminPanel";
import orderService from "../../../services/order.service";
import { useAuth } from "../../../Context/authContext";

export default function ViewOrder() {
  const { id } = useParams();
  const { employee } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = employee?.employee_token;

  // Fetch order
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
    const getStatusText = (status) => {
      switch (status) {
        case 0: return "Received";
        case 1: return "In progress";
        case 2: return "Completed";
        default: return "Unknown";
      }
    };

    const getColor = (status) => {
      switch (status) {
        case 0: return "bg-gray-100 text-gray-800";
        case 1: return "bg-yellow-100 text-yellow-800";
        case 2: return "bg-green-100 text-green-800";
        default: return "bg-blue-100 text-blue-800";
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColor(status)}`}>
        {getStatusText(status)}
      </span>
    );
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading order...</div>;
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

          {/* Customer & Vehicle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Customer */}
            <div className="bg-white shadow-md rounded-lg p-6 border-b-4 border-red-500">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Customer</p>
              <h3 className="font-bold text-lg text-blue-900">{order.customer_first_name} {order.customer_last_name}</h3>
              <p><strong>Email:</strong> {order.customer_email}</p>
              <p><strong>Phone:</strong> {order.customer_phone_number}</p>
              <p><strong>Active:</strong> {order.active_customer === 1 ? 'Yes' : 'No'}</p>
            </div>

            {/* Vehicle */}
            <div className="bg-white shadow-md rounded-lg p-6 border-b-4 border-red-500">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Car in Service</p>
              <h3 className="font-bold text-lg text-blue-900">{order.vehicle_make} {order.vehicle_model} ({order.vehicle_color})</h3>
              <p><strong>Vehicle tag:</strong> {order.vehicle_tag}</p>
              <p><strong>Vehicle year:</strong> {order.vehicle_year}</p>
              <p><strong>Vehicle mileage:</strong> {order.vehicle_mileage}</p>
            </div>
          </div>

          {/* Services */}
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
                    <StatusBadge status={service.service_completed} />
                  </div>
                </div>
              ))}

              {/* Additional Request */}
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

          {/* Order Info */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Order Details</p>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Order ID:</strong> {order.order_id}</p>
              <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
              <p><strong>Price:</strong> ${order.order_total_price || 0}</p>
              <p><strong>Received by:</strong> {order.employee_first_name} {order.employee_last_name}</p>
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
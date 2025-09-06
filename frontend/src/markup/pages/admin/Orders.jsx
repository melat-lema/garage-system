import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LayOut from "../../components/LayOut";
import AdminPanel from "./AdminPanel";
import orderService from "../../../services/order.service";
import { useAuth } from "../../../Context/authContext";
import { toast } from "react-toastify";

export default function Orders() {
  const navigate = useNavigate();
  const { employee } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Fetch orders on load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = employee?.employee_token;
        const data = await orderService.getOrders(token);
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          throw new Error("Invalid order list");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (employee) {
      fetchOrders();
    }
  }, [employee]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'Completed':
          return 'bg-green-100 text-green-800';
        case 'In progress':
          return 'bg-yellow-100 text-yellow-800';
        case 'Received':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-blue-100 text-blue-800';
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {status}
      </span>
    );
  };

  return (
    <LayOut>
      <div className="flex min-h-screen bg-gray-100">
        <AdminPanel />
        
        <main className="flex-1 p-6 md:p-10 pl-40">
          <h1 className="text-2xl font-bold text-blue-900 mb-8 relative inline-block">
            Orders
            <span className="block w-8 h-0.5 bg-red-500 mt-1" />
          </h1>

          {/* Loading */}
          {loading && <p className="text-gray-500">Loading orders...</p>}

          {/* Error */}
          {error && <div className="text-red-500 text-center p-4">{error}</div>}

          {/* Responsive Table Wrapper */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6 md:py-3">Order Id</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6 md:py-3">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6 md:py-3">Vehicle</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6 md:py-3">Order Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6 md:py-3">Received by</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6 md:py-3">Order status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6 md:py-3">View/Edit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.order_id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 md:px-6">{order.order_id}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 md:px-6">
                        <strong>{order.customer_first_name} {order.customer_last_name}</strong><br />
                        {order.customer_email}<br />
                        {order.customer_phone}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 md:px-6">
                        <strong>{order.vehicle_make} {order.vehicle_model}</strong><br />
                        {order.vehicle_year}<br />
                        {order.vehicle_serial}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 md:px-6">{formatDate(order.order_date)}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 md:px-6">Admin {employee.employee_first_name}</td>
                      <td className="px-4 py-4 text-sm md:px-6">
                        <StatusBadge
                          status={
                            order.order_status === 0 ? "Received" :
                            order.order_status === 1 ? "In progress" : "Completed"
                          }
                        />
                      </td>
                      <td className="px-4 py-4 text-sm font-medium space-x-2 md:px-6">
                        <button
                          onClick={() => navigate(`/admin/orders/${order.order_id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigate(`/admin/orders/edit/${order.order_id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </LayOut>
  );
}
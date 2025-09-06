import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Login";
import LayOut from "../../components/LayOut";
import AdminPanel from "./AdminPanel";
import customerService from "../../../services/customer.service"; // ✅ Correct service
import { useAuth } from "../../../Context/authContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Customers() {
  const { employee } = useAuth();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Fetch customers
  useEffect(() => {
    if (!employee) return;

    const token = employee.employee_token; // ✅ Define token

    const fetchCustomers = async () => {
      try {
        const data = await customerService.getCustomers(token); // ✅ Use customerService

        if (data.customers && Array.isArray(data.customers)) {
          let filtered = data.customers;

          if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(cust =>
              cust.customer_first_name.toLowerCase().includes(term) ||
              cust.customer_last_name.toLowerCase().includes(term) ||
              cust.customer_email.toLowerCase().includes(term) ||
              cust.customer_phone_number?.toString().includes(term)
            );
          }

          setTotalPages(Math.ceil(filtered.length / itemsPerPage));
          const start = (currentPage - 1) * itemsPerPage;
          const end = start + itemsPerPage;

          setCustomers(filtered.slice(start, end));
        } else {
          throw new Error(data.message || "Invalid customer list");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [employee, currentPage, searchTerm]);

  // Pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key="first" onClick={() => goToPage(1)} className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">First</button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis-start" className="px-3 py-1 text-sm">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 text-sm border rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'border-gray-300 hover:bg-gray-100'}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis-end" className="px-3 py-1 text-sm">...</span>);
      }
      pages.push(
        <button key="last" onClick={() => goToPage(totalPages)} className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">Last</button>
      );
    }

    return pages;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (!employee) {
    return <Login />;
  }

  return (
    <LayOut>
      <div className="flex min-h-screen bg-gray-100">
        <AdminPanel />
        <main className="flex-1 p-10 pl-40">
          <h1 className="text-2xl font-bold text-blue-900 mb-8 relative inline-block">
            Customers
            <span className="block w-8 h-0.5 bg-red-500 mt-1" />
          </h1>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a customer..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No customers found</td>
                  </tr>
                ) : (
                  customers.map((cust) => (
                    <tr key={cust.customer_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cust.customer_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cust.customer_first_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cust.customer_last_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cust.customer_email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cust.customer_phone_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(cust.customer_added_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cust.active_customer === 1 ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => navigate(`/admin/customers/edit/${cust.customer_id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                        onClick={() => navigate(`/admin/customers/${cust.customer_id}`)}
                        className="text-green-600 hover:text-green-900"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0
                            8.268 2.943 9.542 7-1.274 4.057-5.064
                            7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-1">
              {renderPagination()}
            </div>
          )}

          {/* Toast */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </main>
      </div>
    </LayOut>
  );
}
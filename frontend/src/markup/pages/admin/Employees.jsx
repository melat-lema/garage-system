import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Login";
import LayOut from "../../components/LayOut";
import AdminPanel from "./AdminPanel";
import employeeService from "../../../services/employee.service";
import { useAuth } from "../../../Context/authContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Employees() {
  const { employee } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null); // Store ID only

  const token = employee?.employee_token || "";

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Map role ID to name
  const getRoleName = (roleId) => {
    const roles = { 1: "Employee", 2: "Manager", 3: "Admin" };
    return roles[roleId] || "Unknown";
  };

  // Fetch employees
  useEffect(() => {
    if (!employee) return;

    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getEmployees(token);

        if (data.employees && Array.isArray(data.employees)) {
          setEmployees(data.employees);
        } else {
          throw new Error(data.message || "Invalid or empty employee list");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [employee, token]);

  // Handle delete
  const handleDelete = (employeeId) => {
    setEmployeeToDelete(employeeId); // Open modal
  };

  const confirmDelete = async () => {
    try {
      await employeeService.deleteEmployee(employeeToDelete, token);
      setEmployees((prev) => prev.filter((emp) => emp.employee_id !== employeeToDelete));
      toast.success("🗑️ Employee deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error(`❌ Failed to delete: ${err.message || "Unknown error"}`, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Delete error:", err);
    } finally {
      setEmployeeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setEmployeeToDelete(null);
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
          {/* Page Header */}
          <h1 className="text-2xl font-bold text-blue-900 mb-8 relative inline-block">
            Employees
            <span className="block w-8 h-0.5 bg-red-500 mt-1" />
          </h1>

          {/* Employee Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit/Delete</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No employees found</td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp.employee_id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {emp.active_employee === 1 ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {emp.employee_first_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {emp.employee_last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {emp.employee_email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {emp.employee_phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(emp.added_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getRoleName(emp.company_role_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                        {/* Edit Button */}
                        <button
                          onClick={() => navigate(`/admin/employees/edit/${emp.employee_id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(emp.employee_id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {employeeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete this employee? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </LayOut>
  );
}
import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import LayOut from "../../components/LayOut";
import AdminPanel from "./AdminPanel";
import employeeService from '../../../services/employee.service';
import { useAuth } from "../../../Context/authContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function EditEmployee(){
    const {id}=useParams();
    const navigate = useNavigate();
    const {employee}=useAuth();

    const [formData, setFormData]=useState({
        // employee_email:'',
        employee_first_name:'',
        employee_last_name:'',
        employee_phone:'',
        company_role_id:1,
        active_employee:1
    });
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState(null);
  
  let loggedInEmployee={};
  if(employee){
    loggedInEmployee= employee.employee_token;
  }

    useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await employeeService.getEmployees(loggedInEmployee);
        const emp = data.employees.find(e => e.employee_id === parseInt(id));
        if (!emp) throw new Error("Employee not found");

        setFormData({
          employee_first_name: emp.employee_first_name || "",
          employee_last_name: emp.employee_last_name || "",
        //   employee_email: emp.employee_email || "",
          employee_phone: emp.employee_phone || "",
          company_role_id: emp.company_role_id || 1,
          active_employee: emp.active_employee || 1,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && loggedInEmployee) {
      fetchEmployee();
    }
  }, [id, loggedInEmployee]);

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
      await employeeService.updateEmployee(
        id,
        formData,
        loggedInEmployee
      );
      toast.success("✅ Employee updated successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      });
     setTimeout(() => {
      navigate("/admin/employees");
    }, 1000);// Go back to list
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

    return (

   <LayOut>
     <div className="flex min-h-screen bg-gray-100">
             <AdminPanel />
     <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Employee</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name *</label>
            <input
              type="text"
              name="employee_first_name"
              value={formData.employee_first_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name *</label>
            <input
              type="text"
              name="employee_last_name"
              value={formData.employee_last_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              name="employee_email"
              value={formData.employee_email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="employee_phone"
              value={formData.employee_phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="company_role_id"
              value={formData.company_role_id}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            >
              <option value={1}>Employee</option>
              <option value={2}>Manager</option>
              <option value={3}>Admin</option>
            </select>
          </div>

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              name="active_employee"
              checked={formData.active_employee === 1}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label className="ml-2 text-sm text-gray-700">Active Employee</label>
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
          >
            UPDATE
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/employees")}
            className="bg-gray-300 text-gray-800 py-2 px-6 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </div>
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
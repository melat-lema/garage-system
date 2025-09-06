import React, { useState } from 'react';
import LayOut from '../../components/LayOut';
import AdminPanel from './AdminPanel';
import employeeService from '../../../services/employee.service';
import { useAuth } from '../../../Context/authContext';
export default function AddEmployee() {
  const [employee_email, setEmployeeEmail] = useState('');
  const [employee_first_name, setEmployeeFirstName] = useState('');
  const [employee_last_name, setEmployeeLastName] = useState('');
  const [employee_phone, setEmployeePhone] = useState('');
  const [employee_password, setEmployeePassword] = useState('');
  const [active_employee] = useState(1);
  const [company_role_id, setCompany_role_id] = useState(1);

  const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  let loggedInEmployeeToken='';

  const {employee}=useAuth();
  if(employee){
    loggedInEmployeeToken=employee.employee_token;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setFirstNameError('');
    setLastNameError('');
    setPasswordError('');
    setSuccess('');
    setServerError('');

    let valid = true;

    if (!employee_email) {
      setEmailError('Email is required');
      valid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(employee_email)) {
        setEmailError('Invalid email format');
        valid = false;
      }
    }

    if (!employee_first_name) {
      setFirstNameError('First name is required');
      valid = false;
    }

    if (!employee_last_name) {
      setLastNameError('Last name is required');
      valid = false;
    }

    if (!employee_password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (employee_password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    if (!valid) return;

    const employeeData = {
      employee_email,
      employee_first_name,
      employee_last_name,
      employee_phone,
      employee_password,
      active_employee,
      company_role_id,
    };

   employeeService.createEmployee(employeeData, loggedInEmployeeToken)
  .then((data) => {
    if (data.error) {
      setServerError(data.error);
    } else {
      setSuccess('Employee added successfully');
      setServerError('');
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  })
  .catch((error) => {
    const resMessage =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    setServerError(resMessage);
    console.error('Error creating employee:', resMessage);
  });

  };

  return (
    <LayOut>
      <div className="flex min-h-screen bg-gray-100">
        <AdminPanel />
        <main className="flex-1 p-10 pl-40">
          <h1 className="text-2xl font-bold text-blue-900 mb-8 relative inline-block">
            Add a new employee
            <span className="block w-8 h-0.5 bg-red-500 mt-1" />
          </h1>

          <form className="max-w-md space-y-5" onSubmit={handleSubmit}>
            {emailError && <p className="text-red-500">{emailError}</p>}
            {firstNameError && <p className="text-red-500">{firstNameError}</p>}
            {lastNameError && <p className="text-red-500">{lastNameError}</p>}
            {passwordError && <p className="text-red-500">{passwordError}</p>}
            {success && <p className="text-green-500">{success}</p>}
            {serverError && <p className="text-red-500">{serverError}</p>}

            <input
              type="email"
              placeholder="Employee email"
              value={employee_email}
              onChange={(e) => setEmployeeEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={employee_first_name}
              onChange={(e) => setEmployeeFirstName(e.target.value)}
              placeholder="Employee first name"
              className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={employee_last_name}
              onChange={(e) => setEmployeeLastName(e.target.value)}
              placeholder="Employee last name"
              className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={employee_phone}
              onChange={(e) => setEmployeePhone(e.target.value)}
              placeholder="Employee phone (555-555-5555)"
              className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={company_role_id}
              onChange={(e) => setCompany_role_id(parseInt(e.target.value))}
              className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Employee</option>
              <option value={2}>Admin</option>
              <option value={3}>Manager</option>
            </select>
            <input
              type="password"
              placeholder="Employee password"
              value={employee_password}
              onChange={(e) => setEmployeePassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-red-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-red-700 transition"
            >
              ADD EMPLOYEE
            </button>
          </form>
        </main>
      </div>
    </LayOut>
  );
}

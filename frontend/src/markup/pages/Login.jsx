import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import loginService from "../../services/login.service";
import LayOut from "../components/LayOut";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [employee_email, setEmployeeEmail] = useState('');
  const [employee_password, setEmployeePassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
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

    if (!employee_password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (employee_password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    if (!valid) return;

    const formData = { employee_email, employee_password };

    try {
      const response = await loginService.logIn(formData);
      const data = await response.json();

      if (data.status === 'success' && data.data.employee_token) {
        const token = data.data.employee_token;
        const decoded = JSON.parse(atob(token.split('.')[1]));

        const employeeInfo = {
          employee_token: token,
          employee_role: Number(decoded.employee_role),
          employee_id: decoded.employee_id,
          employee_first_name: decoded.employee_first_name,
          employee_email: decoded.employee_email
        };

        localStorage.setItem("employee", JSON.stringify(employeeInfo));

        if (location.pathname === '/login') {
          window.location.replace('/admin');
        } else {
          window.location.reload();
        }
      } else {
        setServerError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setServerError("An error occurred. Please try again later.");
    }
  };

  return (
    <LayOut>
      {/* Responsive wrapper: centered, full-width on mobile */}
      <div className="flex justify-center mt-24 px-4">
        {/* Keep your original mx-64 style, but make it responsive */}
        <div className="max-w-2xl w-full">
          <h1 className="text-4xl mb-8">Login to your account <span className="text-red-500">_____</span></h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <p className="text-red-500">{emailError}</p>
            <p className="text-red-500">{passwordError}</p>
            <p className="text-red-500">{serverError}</p>

            {/* Responsive inputs: full-width on mobile, fixed width on desktop */}
            <input
              name="employee_email"
              value={employee_email}
              type="email"
              placeholder="Email"
              className="border p-2 mb-4 w-full md:w-96"
              onChange={(e) => setEmployeeEmail(e.target.value)}
            />
            <input
              name="employee_password"
              value={employee_password}
              type="password"
              placeholder="Password"
              className="border p-2 mb-4 w-full md:w-96"
              onChange={(e) => setEmployeePassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-red-500 text-white p-2 w-full md:w-32 mb-14"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </LayOut>
  );
}
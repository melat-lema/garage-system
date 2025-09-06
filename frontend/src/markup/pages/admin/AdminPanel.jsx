import React from "react";

// AdminPanel.jsx
import { Link } from "react-router-dom";

export default function AdminPanel() {
  return (
    <aside className="w-64 bg-blue-800 text-white p-6 min-h-screen">
      <h2 className="text-lg font-semibold mb-6">ADMIN MENU</h2>
      <nav className="space-y-3 text-sm">
        <Link to="/admin" className="block hover:text-gray-300">
          Dashboard
        </Link>
        <hr className="border-gray-500" />
        <Link to="/admin/orders" className="block hover:text-gray-300">
          Orders
        </Link>
        <hr className="border-gray-500" />
        <Link to="/admin/new-order" className="block hover:text-gray-300">
          New Order
        </Link>
        <hr className="border-gray-500" />
        <Link to="/admin/add-employee" className="block hover:text-gray-300">
          Add employee
        </Link>
        <hr className="border-gray-500" />
        <Link to="/admin/employees" className="block hover:text-gray-300">
          Employees
        </Link>
        <hr className="border-gray-500" />
        <Link to="/admin/add-customer" className="block hover:text-gray-300">
          Add customer
        </Link>
        <hr className="border-gray-500" />
        <Link to="/admin/customers" className="block hover:text-gray-300">
          Customers
        </Link>
        <hr className="border-gray-500" />
        <Link to="/admin/services" className="block hover:text-gray-300">
          Services  
        </Link>
        <hr className="border-gray-500" />
      </nav>
    </aside>
  );
}

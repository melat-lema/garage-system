import React, { StrictMode } from 'react';
import { Routes,Route } from 'react-router';

import Login from './markup/pages/Login';
// import Header from './markup/components/Header';
// import Footer from './markup/components/Footer';
import Home from './markup/pages/Home';
import AddEmployee from './markup/pages/admin/AddEmployee';
// import Unauthorized from './markup/pages/Unauthorized';
import './index.css'
import privateAuthRoute from './markup/components/PrivateAuthRoute'; 
// import Orders from './markup/pages/admin/Orders';
// import Customer from './markup/pages/admin/Customer';
import Employees from './markup/pages/admin/Employees';
import AddCustomer from './markup/pages/admin/AddCustomer';
import EditEmployee from './markup/pages/admin/EditEmployee';
import AdminDashboardContent from './markup/pages/admin/Dashboard';
import Customers from './markup/pages/admin/Customer';
import EditCustomer from './markup/pages/admin/EditCustomer';
import CustomerProfile from './markup/pages/admin/CustomerProfile';

import Services from './markup/pages/admin/Services';
import ServiceAdd from './markup/pages/admin/ServiceAdd';
import ServiceEdit from './markup/pages/admin/ServiceEdit';
import NewOrder from './markup/pages/admin/NewOrder';
import Orders from './markup/pages/admin/Orders';
import OrderDetails from './markup/pages/admin/OrderDetail';
import ViewOrder from './markup/pages/admin/ViewOrder';
export default function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login />} />      
      {/* <Route path='/footer' element={<Footer/>}/>  */}
        <Route path="/admin" element={<privateAuthRoute roles={[3]}>
        < AdminDashboardContent />
      </privateAuthRoute>} />
      <Route path="/admin/add-employee" element={<privateAuthRoute roles={[3]}>
        <AddEmployee />
      </privateAuthRoute>} />
      <Route path="/admin/add-customer" element={<privateAuthRoute roles={[3]}>
        <AddCustomer />
      </privateAuthRoute>} />
      {/* <Route path='/unauthorized' element={<Unauthorized/>}/>  */}
      {/* <Route path="/admin/order" 
      element={<privateAuthRoute roles={[1,2,3]}>
        <Orders/>
      </privateAuthRoute>}/> */}
      <Route path="/admin/customers" element={<privateAuthRoute role={[2, 3]}>
        <Customers/>
      </privateAuthRoute>}/>
      <Route path="/admin/customers/edit/:id" element={<privateAuthRoute roles={[2, 3]}>
        <EditCustomer />
      </privateAuthRoute>} />
      <Route path="/admin/customers/:id" element={<privateAuthRoute roles={[2, 3]}>
        <CustomerProfile/>
      </privateAuthRoute>} />
      {/* employee service and match more */}
      <Route path="/admin/employees" element={<privateAuthRoute roles={[3]}>
        < Employees />
      </privateAuthRoute>} />
      {/* customer service and match more */}
      <Route path="/admin/employees/edit/:id" element={<privateAuthRoute roles={[3]}>
        <EditEmployee />
      </privateAuthRoute>} />
      <Route path="/admin/orders" element={<privateAuthRoute roles={[1,2,3]}>
        <Orders/>
      </privateAuthRoute>} />
      <Route path='/admin/services' element={<privateAuthRoute roles={[3]}>
        < Services/>
      </privateAuthRoute>}/>
      <Route path='/admin/services/new' element={<privateAuthRoute roles={[3]}>
        < ServiceAdd/>
      </privateAuthRoute>}/>
      <Route path='/admin/services/edit/:id' element={<privateAuthRoute roles={[3]}>
        < ServiceEdit/>
      </privateAuthRoute>}/>
      <Route path='/admin/new-order' element={<privateAuthRoute roles={[2,3]}>
        < NewOrder/>
      </privateAuthRoute>}/>
      <Route path='/admin/orders/edit/:id' element={<privateAuthRoute roles={[1,2,3]}>
        < OrderDetails/>
      </privateAuthRoute>}/>
      <Route path='/admin/orders/:id' element={<privateAuthRoute roles={[1,2,3]}>
        < ViewOrder/>
      </privateAuthRoute>}/>  
      <Route path="*" element={<div className="p-8">Page not found</div>} />
    </Routes>
    
  );
}

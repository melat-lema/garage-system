import React, {useState} from 'react';
import {useLocation} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/authContext';
import loginService from '../../services/login.service';
import logo from '../../assets/images/logo.png'; // Adjust the path as necessary
export default function Header(props) {
  const location = useLocation();
     const [isOpen, setIsOpen] = useState(false);
  
 const {isLogged, setIsLogged, employee}= useAuth()
 const logOut=()=>{
  loginService.logOut();
  setIsLogged(false);
 }
  return (
    <div className='flex flex-col w-full sticky top-0 z-50'>
      <div className="flex flex-col md:flex-row text-white">
    
    {/* Left - Red Box */}
    <div className="bg-red-800 w-full md:w-1/5 p-2 flex items-center justify-center">
      <p className="text-sm text-center md:text-left">
        Enjoy your beso while we fix your car
      </p>
    </div>

    {/* Right - Blue Box with two items */}
    <div className="bg-blue-900 w-full md:w-4/5 p-2 flex flex-col md:flex-row items-center justify-between">
      <p className="text-sm text-center md:text-left">
        Monday - Saturday 7:00am - 6:00pm
      </p>
     <div className="text-sm font-bold text-center md:text-right pr-32">
  {isLogged ? (
    <span>Welcome {employee?.employee_first_name}</span>
  ) : (
    <span>Schedule Appointment: 1800 456 7890</span>
  )}
</div>

    </div>

  </div>
      {/* Bottom Bar (empty for now) */}
      
        {/* Add navigation or other content here */}
      <nav className="bg-blue-950 p-4 shadow-md ">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <div className="text-xl font-bold">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <a href="/" className="hover:text-blue-500">Home</a>
          <a href="#about" className="hover:text-blue-500">About Us</a>
          <a href="#services" className="hover:text-blue-500">Services</a>
          <a href="#contact" className="hover:text-blue-500">Contact Us</a>
          {isLogged ?  (
            <>
              <span className="border-l border-gray-400 h-6 mx-2"></span>

              {/* Login/Sign In Button */}
              <Link
                to="/"
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={logOut}
              >
                LogOut
              </Link>
            </>
          ): (
            <div>
              <span className="border-l border-gray-400 h-6 mx-2"></span>

              <Link
                to="/login"
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            {/* Hamburger Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-900 mt-2 py-2 px-4 space-y-2 text-white">
          <a href="/" className="block hover:text-blue-300">Home</a>
          <a href="/about" className="block hover:text-blue-300">About Us</a>
          <a href="/services" className="block hover:text-blue-300">Services</a>
          <a href="/contact" className="block hover:text-blue-300">Contact Us</a>

          {/* {isAdminLoggedIn && (
            <a href="/admin" className="block hover:text-blue-300">Admin</a>
          )} */}

          {isLogged ? (
            <Link
              to="/"
              className="block text-center text-blue-950 py-2 rounded hover:bg-blue-200"
            onClick={logOut}
            >
               LogOut
            </Link>
          ): (
            <Link
              to="/login"
              className="block text-center  text-blue-950 py-2 rounded hover:bg-gray-200"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
      </div>
    
  );
}
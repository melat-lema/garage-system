import React , {useState, useEffect} from 'react';
import LayOut from '../../components/LayOut';
import AdminPanel from './AdminPanel';
import customerService from '@/services/customer.service';


export default function AddCustomer() {
    const [customer_email, setCustomerEmail]=useState('')
    const [customer_first_name, setCustomerFirstName]= useState('')
    const [customer_last_name, setCustomerLastName]=useState('');
    const [customer_phone_number, setCustomerPhone]=useState('');

    const [emailError, setEmailError]= useState('');
    const [firstNameError, setFirstNameError]= useState('');
    const [lastNameError, setLastNameError]= useState('');
    const [phoneError, setPhoneError]= useState('');
    const [success, setSuccess]= useState('');
    const [serverError, setServerError]= useState('');


    const handleSubmit =async(e)=>{
        e.preventDefault();
        setEmailError('');
        setFirstNameError('');
        setLastNameError("");
        setSuccess('');
        setServerError('');
        let valid=true;

        if(!customer_email){
            setEmailError("Email is required");
            valid=false;
        }else{
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailPattern.test(customer_email)){
                setEmailError('Invalid email format');
                valid=false;
            }   
            
        }
        if(!customer_first_name){
            setFirstNameError("First name is required!")
            valid=false;
        }
        if(!customer_last_name){
            setLastNameError("Last name is required!")
            valid=false;
        }
        if(!customer_phone_number){
            setPhoneError("Phone number is required!")
            valid=false;
        }
         if (!valid) return;

         const customerData={
            customer_email,
            customer_first_name,
            customer_last_name,
            customer_phone_number
         }
         customerService.createCustomer(customerData)
         .then((data)=>{
            if(data.error){
                setServerError(data.error);

            }
            else{
                setSuccess("Customer added successfully!")
                setServerError('');
      setTimeout(() => {
        window.location.href = "/admin/customers";
      }, 2000);
            }
         })
           .catch((error) => {
    const resMessage =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    setServerError(resMessage);
    console.error('Error creating customer:', resMessage);
  });

    }

        return(
        <LayOut>
            <div className="flex min-h-screen bg-gray-100">
                    <AdminPanel />
                    <main className="flex-1 p-10 pl-40">
                      <h1 className="text-2xl font-bold text-blue-900 mb-8 relative inline-block">
                        Add a new customer
                        <span className="block w-8 h-0.5 bg-red-500 mt-1" />
                      </h1>
            
                      <form className="max-w-md space-y-5" onSubmit={handleSubmit}>
                        {emailError && <p className="text-red-500">{emailError}</p>}
                        {firstNameError && <p className="text-red-500">{firstNameError}</p>}
                        {lastNameError && <p className="text-red-500">{lastNameError}</p>}
                        {phoneError && <p className="text-red-500">{phoneError}</p>}
                        {success && <p className="text-green-500">{success}</p>}
                        {serverError && <p className="text-red-500">{serverError}</p>}
            
                        <input
                          type="email"
                          placeholder="Customer email"
                          value={customer_email}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={customer_first_name}
                          onChange={(e) => setCustomerFirstName(e.target.value)}
                          placeholder="Customer first name"
                          className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={customer_last_name}
                          onChange={(e) => setCustomerLastName(e.target.value)}
                          placeholder="Customer last name"
                          className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={customer_phone_number
                          }
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Customer phone (555-555-5555)"
                          className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        
                        <button
                          type="submit"
                          className="bg-red-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-red-700 transition"
                        >
                          ADD CUSTOMER
                        </button>
                      </form>
                    </main>
                  </div>
        </LayOut>
    )
}
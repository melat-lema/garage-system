//a function to add a new employee
//import from env
const api_url = import.meta.env.VITE_API_URL;
async function createEmployee(employeeData, loggedInEmployeeToken) {
    const requestOption={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': loggedInEmployeeToken
        },
        body: JSON.stringify(employeeData),
    };
    const response = await fetch(`${api_url}/api/employee`, requestOption);
   return response.json();
}
async function getEmployees(token) {
  const response = await fetch(`${api_url}/api/employees`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
}

async function updateEmployee(employeeId, employeeData, token) {
    const response = await fetch(`${api_url}/api/employee/${employeeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
        },
        body: JSON.stringify(employeeData),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}`);
    }

    return responseData;
}

async function deleteEmployee(employeeId, token) {
    const response = await fetch(`${api_url}/api/employee/${employeeId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
        },
    });

    const responseData = await response.json();
    
    if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}`);
    }

    return responseData;
}
   //export all functions
   const employeeService = {

    createEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee
   
   };           
    
export default employeeService;
const api_url = import.meta.env.VITE_API_URL;

async function createCustomer(customerData){
    const requestOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
    };
    const response = await fetch(`${api_url}/api/customer`, requestOption);
    return response.json();
}
async function getCustomers(token) {
  const response = await fetch(`${api_url}/api/customers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json(); // { status: 'success', customers: [...] }
}


async function updateCustomer(customerId, customerData, token) {
  const response = await fetch(`${api_url}/api/customer/${customerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(customerData),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || `HTTP ${response.status}`);
  }

  return responseData;
}


async function deleteCustomer(customerId, token) {
  const response = await fetch(`${api_url}/api/customer/${customerId}`, {
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

const customerService={
    createCustomer,
    getCustomers,
    updateCustomer
}
export default customerService;
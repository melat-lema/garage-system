const api_url = import.meta.env.VITE_API_URL;

async function getServices(token) {
  const res = await fetch(`${api_url}/api/services`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-access-token': token } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data; // { services: [...] }
}

async function getService(id, token) {
  const res = await fetch(`${api_url}/api/service/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-access-token': token } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data.service;
}

async function createService(payload, token) {
  const res = await fetch(`${api_url}/api/service`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

async function updateService(id, payload, token) {
  const res = await fetch(`${api_url}/api/service/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

async function deleteService(id, token) {
  const res = await fetch(`${api_url}/api/service/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

const commonService = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
};
export default commonService;

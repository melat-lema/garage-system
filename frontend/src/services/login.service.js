const api_url = import.meta.env.VITE_API_URL;

function getAuthHeader() {
    const employee = JSON.parse(localStorage.getItem("employee"));
    if (employee && employee.employee_token) {
        return { Authorization: `Bearer ${employee.employee_token}` };
    }
    return {};
}

async function logIn(formData) {
    const requestOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    };
    const response = await fetch(`${api_url}/api/employee/login`, requestOption);
    return response;
}

// Example: secured request (after login)
async function getEmployees() {
    const requestOption = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(), // 🔑 attach token
        },
    };
    const response = await fetch(`${api_url}/api/employee`, requestOption);
    return response;
}

const loginService = {
    logIn,
    getEmployees,
    logOut: () => localStorage.removeItem("employee"),
};

export default loginService;

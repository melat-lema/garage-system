// Function to decode the JWT payload (synchronous)
const decodeTokenPayload = (token) => {
    try {
        if (!token || typeof token !== 'string') {
            console.warn("Invalid token: not a string");
            return {};
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
            console.warn("Invalid JWT: must have 3 parts");
            return {};
        }

        const base64Url = parts[1]; // payload
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error("⚠️ Failed to decode token:", err);
        return {};
    }
};

// Function to get auth data from localStorage
const getAuth = () => {
    try {
        const employeeData = localStorage.getItem('employee');
        const employee = employeeData ? JSON.parse(employeeData) : null;

        if (employee && employee.employee_token) {
            const decodedToken = decodeTokenPayload(employee.employee_token);

            // Only assign if decodedToken has these fields
            employee.employee_role = decodedToken.employee_role || null;
            employee.employee_id = decodedToken.employee_id || null;
            employee.employee_first_name = decodedToken.employee_first_name || null;

            return employee;
        }

        // Return empty object or a standardized "not logged in" shape
        return {};
    } catch (err) {
        console.error("Error reading auth from localStorage:", err);
        return {};
    }
};

export default getAuth;
import React, { useState, useEffect, useContext } from 'react';
import getAuth from '../util/auth'; // Must be synchronous

const AuthContext = React.createContext();

function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const [employee, setEmployee] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const value = { isLogged, isAdmin, setIsAdmin, setIsLogged, employee };

    useEffect(() => {
        try {
            const response = getAuth(); // ✅ Synchronous call

            if (response && response.employee_token) {
                setIsLogged(true);
                setEmployee(response);

                // Check if admin (role === 3)
                if (response.employee_role && Number(response.employee_role) === 3) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false); // explicit
                }
            } else {
                // No valid auth data
                setIsLogged(false);
                setIsAdmin(false);
                setEmployee(null);
            }
        } catch (err) {
            console.error("Failed to initialize auth:", err);
            setIsLogged(false);
            setIsAdmin(false);
            setEmployee(null);
        }
    }, []); // ✅ Empty dep array: runs once on mount

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider, useAuth };
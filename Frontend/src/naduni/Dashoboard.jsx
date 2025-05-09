import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Dashboard = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            const fetchData = async () => {
                try {
                    const response = await axios.post(`http://localhost:5001/user/${userId}`);
                    setUser(response.data.user);
                } catch (err) {
                    setError("Failed to fetch data.");
                }
            };
            fetchData();
        } catch (err) {
            setError("Failed to decode token.");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const handleOpenTranslator = () => {
        navigate('/Translator/pg'); // Use navigate to redirect
    };

    // if (error) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //             <p className="text-red-500 text-lg font-semibold">{error}</p>
    //         </div>
    //     );
    // }

    // if (!user) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //             <p className="text-gray-500 text-lg font-semibold">Loading...</p>
    //         </div>
    //     );
    // }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-950 to-purple-900">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Welcome, {user.userName}</h1>
                <div className="flex justify-center mb-4">
                    {/* {user.profilePicture && (
                        <img src={user.profilePicture} alt="Profile" className="h-24 w-24 rounded-full border-4 border-blue-500" />
                    )} */}
                </div>
                <p className="text-gray-700 text-lg text-center mb-6">Email: {user.email}</p>
                <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 mb-4"
                >
                    Logout
                </button>
                <button
                    onClick={handleOpenTranslator}
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Open Translator
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
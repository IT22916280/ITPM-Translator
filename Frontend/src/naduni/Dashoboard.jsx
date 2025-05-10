import React, { useEffect, useState } from 'react';
import {jwtDecode} from "jwt-decode";
import axios from 'axios';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa'; // Import icons

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [updateField, setUpdateField] = useState({ field: '', value: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("You are not logged in.");
            return;
        }

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

    const handleFieldUpdate = async (field) => {
        if (!user) return;

        try {
            const response = await axios.put(`http://localhost:5001/update/${user._id}`, {
                [field]: updateField.value,
            });
            setUser(response.data.user);
            alert(`${field} updated successfully!`);
            setUpdateField({ field: '', value: '' });
        } catch (err) {
            console.error(`Error updating ${field}:`, err.message);
            alert(`Failed to update ${field}.`);
        }
    };

    const handleCancelUpdate = () => {
        setUpdateField({ field: '', value: '' }); // Reset the update field state
    };

    const handleDelete = async () => {
        if (!user) return;

        const confirmDelete = window.confirm("Are you sure you want to delete your account?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5001/delete/${user._id}`);
            alert("User deleted successfully!");
            handleLogout(); // Log out the user after deletion
        } catch (err) {
            console.error("Error deleting user:", err.message);
            alert("Failed to delete user.");
        }
    };

    const handleOpenTranslator = () => {
        window.location.href = '/';
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
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full relative">
                {/* Delete Button */}
                <button
                    onClick={handleDelete}
                    className="absolute top-8 right-6 text-red-500 hover:text-red-700 hover:bg-gray-300 hover:rounded-full p-2 transition duration-300"
                >
                    <FaTrash size={20} />
                </button>

                <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Welcome, {user.userName}</h1>
                <div className="flex justify-center mb-4">
                    {/* {user.profilePicture && (
                        <img src={user.profilePicture} alt="Profile" className="h-24 w-24 rounded-full border-4 border-blue-500" />
                    )} */}
                </div>

                {/* User Details */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Username:</span>
                        <span className="text-gray-900">{user.userName}</span>
                        <button
                            onClick={() =>
                                updateField.field === 'userName'
                                    ? handleCancelUpdate()
                                    : setUpdateField({ field: 'userName', value: user.userName })
                            }
                            className="text-blue-500 hover:text-blue-700 transition duration-300"
                        >
                            {updateField.field === 'userName' ? <FaTimes size={16} /> : <FaEdit size={16} />}
                        </button>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Email:</span>
                        <span className="text-gray-900">{user.email}</span>
                        <button
                            onClick={() =>
                                updateField.field === 'email'
                                    ? handleCancelUpdate()
                                    : setUpdateField({ field: 'email', value: user.email })
                            }
                            className="text-blue-500 hover:text-blue-700 transition duration-300"
                        >
                            {updateField.field === 'email' ? <FaTimes size={16} /> : <FaEdit size={16} />}
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Profile Picture:</span>
                        <span className="text-gray-400">Edit the URL here...</span>
                        <button
                            onClick={() =>
                                updateField.field === 'profilePicture'
                                    ? handleCancelUpdate()
                                    : setUpdateField({ field: 'profilePicture', value: user.profilePicture })
                            }
                            className="text-blue-500 hover:text-blue-700 transition duration-300"
                        >
                            {updateField.field === 'profilePicture' ? <FaTimes size={16} /> : <FaEdit size={16} />}
                        </button>
                    </div>
                </div>

                {/* Update Field */}
                {updateField.field && (
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder={`Update ${updateField.field}`}
                            value={updateField.value}
                            onChange={(e) => setUpdateField({ ...updateField, value: e.target.value })}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <button
                            onClick={() => handleFieldUpdate(updateField.field)}
                            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                        >
                            Update {updateField.field}
                        </button>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 mt-4"
                >
                    Logout
                </button>
                <button
                    onClick={handleOpenTranslator}
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 mt-2"
                >
                    Open Translator
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
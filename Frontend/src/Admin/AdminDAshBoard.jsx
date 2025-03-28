import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faUserShield, faComments, faUsers, faBook, faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from './NavigationBar';

function AdminDAshBoard() {
    const navigate = useNavigate();

    const handleCardClick = (path) => {
      navigate(path);
    };
  
    const handleLogout = () => {
      // Implement logout logic here
      alert('Logged out');
      navigate('/login'); // Redirect to the login page after logging out
    };
  
    return (
      <div className="flex min-h-screen">
        <NavigationBar/>
       
  
        <div className="flex-1 p-6 bg-gray-100">
          {/* Header Section */}
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
            {/* System Name */}
            <h1 className="text-3xl font-bold text-gray-800">Translator</h1>
  
            {/* Page Title */}
            <h2 className="text-2xl font-semibold text-gray-600">Admin Dashboard</h2>
  
            {/* Right-side Icons */}
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <FontAwesomeIcon icon={faBell} className="text-gray-600 text-2xl cursor-pointer" />
              
              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
                <span>Logout</span>
              </button>
            </div>
          </div>
  
          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <div 
              className="bg-white p-6 rounded-lg shadow-lg cursor-pointer flex items-center space-x-6 min-h-[200px]"  
              onClick={() => handleCardClick('/viewAllAdmins')}
            >
              <FontAwesomeIcon icon={faUserShield} className="text-gray-500 text-5xl" /> 
              <div>
                <h3 className="text-2xl font-bold mb-2">Admins</h3> 
                <p className="text-lg text-gray-600">View and manage admin details.</p>  
              </div>
            </div>
  
            <div 
              className="bg-white p-6 rounded-lg shadow-lg cursor-pointer flex items-center space-x-6 min-h-[200px]"  
              onClick={() => handleCardClick('/viewFeedbackAdmin')}
            >
              <FontAwesomeIcon icon={faComments} className="text-gray-500 text-5xl" /> 
              <div>
                <h3 className="text-2xl font-bold mb-2">Feedbacks</h3> 
                <p className="text-lg text-gray-600">View and manage user feedbacks.</p>  
              </div>
            </div>
  
            <div 
              className="bg-white p-6 rounded-lg shadow-lg cursor-pointer flex items-center space-x-6 min-h-[200px]"  
              onClick={() => handleCardClick('/users')}
            >
              <FontAwesomeIcon icon={faUsers} className="text-gray-500 text-5xl" /> 
              <div>
                <h3 className="text-2xl font-bold mb-2">Users</h3>  
                <p className="text-lg text-gray-600">View and manage user accounts.</p> 
              </div>
            </div>
  
            <div 
              className="bg-white p-6 rounded-lg shadow-lg cursor-pointer flex items-center space-x-6 min-h-[200px]" 
              onClick={() => handleCardClick('/viewWordslist')}
            >
              <FontAwesomeIcon icon={faBook} className="text-gray-500 text-5xl" /> 
              <div>
                <h3 className="text-2xl font-bold mb-2">Word List</h3>  
                <p className="text-lg text-gray-600">Manage and view word lists.</p>  
              </div>
            </div>
  
          </div>
        </div>
      </div>
    );
}
export default AdminDAshBoard

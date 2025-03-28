import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserShield, faUsers, faBook, faComments } from '@fortawesome/free-solid-svg-icons';

export default function NavigationBar() {
    return (
        <div className="min-h-screen w-64 bg-gradient-to-b from-gray-800 to-black text-white flex flex-col justify-between">
          {/* Admin Info */}
          <div>
            <div className="p-6 flex flex-col items-center">
              {/* Admin Image */}
              <img 
                src="https://rapidkings.com/wp-content/uploads/2023/05/rashmika_mandanna_trolling_should_i_leave-three_four-225x300.jpg" // Replace with the admin's image URL
                alt="Admin"
                className="w-24 h-24 rounded-full mb-4 border-4 border-gray-700 shadow-lg"
              />
              {/* Admin Name */}
              <h2 className="text-xl font-semibold mb-2">Admin Name</h2> {/* Replace with the admin's actual name */}
              <p className="text-gray-400 text-sm">Administrator</p>
            </div>
    
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-2 px-6">
              <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded flex items-center">
                <FontAwesomeIcon icon={faHome} className="mr-2 text-lg" /> Home
              </Link>
              <Link to="/viewAllAdmins" className="text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded flex items-center">
                <FontAwesomeIcon icon={faUserShield} className="mr-2 text-lg" /> Admins
              </Link>
              <Link to="/users" className="text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded flex items-center">
                <FontAwesomeIcon icon={faUsers} className="mr-2 text-lg" /> Users
              </Link>
              <Link to="/viewWordslist" className="text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded flex items-center">
                <FontAwesomeIcon icon={faBook} className="mr-2 text-lg" /> Word List
              </Link>
              <Link to="/viewFeedbackAdmin" className="text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded flex items-center">
                <FontAwesomeIcon icon={faComments} className="mr-2 text-lg" /> Feedbacks
              </Link>
            </nav>
          </div>
    
          {/* Contact & Copyright Info */}
          <div className="text-center text-xs text-gray-400 p-4">
            <p>Contact: <a href="mailto:codewave@gmail.com" className="underline">codewave@gmail.com</a></p>
            <p>© 2024 Design By <span className="font-bold text-gray-300">Code Wave</span></p>
          </div>
        </div>
      );
}

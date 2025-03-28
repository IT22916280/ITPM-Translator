import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import NavigationBar from "./NavigationBar";

export default function AdminTable() {
    const [admins, setAdmins] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchAdmins = async () => {
        try {
          const response = await axios.get("http://localhost:5001/alladmins");
          setAdmins(response.data.data);
        } catch (error) {
          console.error("Failed to fetch admins:", error);
        }
      };
  
      fetchAdmins();
    }, []);
  
    const handleUpdate = (id) => {
      navigate(`/updateadmin/${id}`);
    };
  
    const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this admin?")) {
        try {
          await axios.delete(`http://localhost:5001/deleteadmin/${id}`);
          setAdmins(admins.filter((admin) => admin._id !== id));
          alert("Admin deleted successfully.");
        } catch (error) {
          console.error("Failed to delete admin:", error);
          alert("Failed to delete admin.");
        }
      }
    };
  
    const handleAddNew = () => {
      navigate("/createadmin");
    };
  
    /*const handleGenerateReport = () => {
      const doc = new jsPDF();
      doc.text("Admins Report", 14, 10);
      
      const headers = [["Admin ID", "Admin Name", "Admin Email", "Username"]];
  
      const data = admins.map((admin) => [
        admin.adminID,
        admin.adminName,
        admin.adminEmail,
        admin.username,
      ]);
  
      doc.autoTable({
        head: headers,
        body: data,
        startY: 20,
      });
  
      doc.save("admins_report.pdf");
    };*/
  
    // Function to generate PDF
    const handleDownloadPDF = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.get(
          "http://localhost:5001/generateAdminReport",
          
        );
  
        const { filepath } = response.data;
  
        // Create a new <a> element to simulate a download link
        const link = document.createElement("a");
        // Set the href attribute of the link to the filepath of the generated invoice
        link.href = filepath;
        // Set the "download" attribute to specify the default file name for the downloaded file
        link.setAttribute("download", "invoice.pdf");
        // Append the link to the document body
        document.body.appendChild(link);
  
        // Simulate a click on the link to trigger the download
        link.click();
  
         // Remove the link from the document body after the download is complete
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading invoice:", error.message);
      }
    };
  
    return (
      <div className="flex min-h-screen">
        <NavigationBar/>
  
        <div className="flex-1 p-6 bg-gray-100">
          <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold mb-4">All Admins</h2>
              <div>
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ease-in-out mr-4"
                >
                  Generate Report
                </button>
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 ease-in-out"
                >
                  Add New Admin
                </button>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {admin.adminID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.adminName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.adminEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleUpdate(admin._id)}
                        className="text-blue-600 hover:bg-blue-100 hover:text-blue-900 px-4 py-2 border border-blue-300 rounded-md shadow-sm font-semibold transition-colors duration-300 ease-in-out"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="text-red-600 hover:bg-red-100 hover:text-red-900 px-4 py-2 border border-red-300 rounded-md shadow-sm font-semibold transition-colors duration-300 ease-in-out ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
}

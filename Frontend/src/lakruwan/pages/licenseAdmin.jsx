// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import LicenseCardAdmin from "../component/licenseCardAdmin";
// import NavigationBar from "../../Admin/NavigationBar";
// import LicenseForm from "../component/licenseForm";

// // const licenseData = [
// //     { 
// //         id: 1, 
// //         title: "Basic Translator", 
// //         description: "Translate up to 10 words per day with essential language support.", 
// //         price: "$29/year", 
// //         validity: "1 Year", 
// //         features: ["10 words per day", "Basic language support", "Limited access to AI models"] 
// //     },
// //     { 
// //         id: 2, 
// //         title: "Advanced Translator", 
// //         description: "Get access to 50 words per day, expanded language support", 
// //         price: "$59/year", 
// //         validity: "1 Year", 
// //         features: ["50 words per day", "Expanded language support", "Priority AI-enhanced translations"] 
// //     },
// //     { 
// //         id: 3, 
// //         title: "Ultimate Translator", 
// //         description: "Unlimited translations with full access to all supported languages", 
// //         price: "$99/year", 
// //         validity: "1 Year", 
// //         features: ["Unlimited translations", "Full language support", "Instant processing"] 
// //     }
// // ];

// export default function LicenseAdmin() {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [showForm, setShowForm] = useState(false);

//   useEffect(() => {
//   const fetchFeedbacks = async () => {
//     try {
//       const response = await axios.get("http://localhost:5001/license/get");
//       if (response.data && Array.isArray(response.data)) {
//         setFeedbacks(response.data);
//       } else {
//         setError("Invalid data format received.");
//       }
//     } catch (err) {
//       console.error("Error fetching feedbacks:", err);
//     }
//   };
//   fetchFeedbacks();
// }, []);

//   console.log("CHECK",feedbacks)
//   return (
//     <div className="flex container">
//     <div>
//       <NavigationBar></NavigationBar>
//         {/* <h1 className="h1-style text-center">Upgrade to unleash everything</h1>
//         <p className="mb-4 text-center  text-md text-gray-500 pt-4 pb-6"> 
//             Select a translation plan that fits your needs. Whether you need basic daily translations or unlimited access with advanced AI support, our plans provide the right balance of features and affordability. Purchase your license today and start translating with ease
//         </p>         */}
//     </div>

//     <div className="flex flex-col p-6">
//       <div>
//         <div className="flex max-w-[61%]">
//             <div className="flex justify-center gap-6 p-6">
//             {feedbacks && feedbacks.length > 0 ? (
//                 feedbacks
//                 .map((license) => (
//                 <LicenseCardAdmin
//                     key={license.id}
//                     title={license.licenseName || "No title"}
//                     description={license.title || "No description"}
//                     price={license.price || "N/A"}
//                     validity={license.validity || "1 Year"}
//                     features={
//                     Array.isArray(license.description)
//                         ? license.description
//                         : license.description
//                         ? license.description.split(", ")
//                         : []
//                     }
//                 />
//                 ))
//             ) : (
//                 <p className="text-center">No licenses available.</p>
//             )}
//             </div>
//         </div>

//         {/* Conditionally Render the Form */}
//         {showForm && (
//             <div className="">
//             <LicenseForm />
//             </div>
//         )}

//         {/* Button to Show Form */}
//         <div className="mt-6">
//             <button 
//             className="bg-blue-500 w-[97%] text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
//             onClick={() => setShowForm(!showForm)}
//             >
//             {showForm ? "Close Form" : "Add License"}
//             </button>
//         </div>
//       </div>
//     </div>
//     </div>
//   )
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import NavigationBar from "../../Admin/NavigationBar";
import LicenseForm from "../component/licenseForm";
import UpdateLicenseForm from "../component/licenseUpdateForm";

const LicenseCardAdmin = ({ title, description, price, validity, features, onDelete, id, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-600 mt-1 text-sm">{description}</p>
        </div>

        <div className="mb-4 py-3 border-y border-gray-100">
          <span className="text-2xl font-bold text-indigo-600">{price}</span>
          <span className="text-gray-500 text-sm ml-1">/year</span>
        </div>

        <div className="mb-4 flex items-center">
          <span className="text-gray-700 text-sm font-medium">Validity:</span>
          <span className="ml-2 text-gray-600 text-sm">{validity}</span>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Purchase</h3>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => onEdit(id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm shadow-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function LicenseAdmin() {
  const [licenses, setLicenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingLicense, setEditingLicense] = useState(null);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const response = await axios.get("http://localhost:5001/license/get");
        if (response.data && Array.isArray(response.data)) {
          setLicenses(response.data);
        }
      } catch (err) {
        console.error("Error fetching licenses:", err);
      }
    };
    fetchLicenses();
  }, []);

  const filteredLicenses = licenses.filter((license) =>
    license.licenseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    license.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
  
    // Set fonts for the title and content
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("License Details", 14, 20);
  
    // Add Exported Date with smaller font size
    const exportedDate = new Date().toLocaleDateString("en-GB");  // "DD/MM/YYYY" format
    doc.setFontSize(10); // Smaller font for the date
    doc.text(`Exported on: ${exportedDate}`, 14, 30);
  
    // Add a horizontal line (border)
    doc.setLineWidth(0.5);
    doc.line(14, 32, 200, 32);  // From x=14, y=32 to x=200, y=32;
  
    // Add footer with page number
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`, 180, 285);
  
    // Add table with headers and rows
    const tableColumn = ["Name", "Title", "Price", "Validity", "Features"];
    const tableRows = [];
  
    filteredLicenses.forEach((license) => {
      const features = Array.isArray(license.description)
        ? license.description.join(", ")
        : license.description
          ? license.description
          : "No features";
  
      const licenseData = [
        license.licenseName || "N/A",
        license.title || "N/A",
        license.price ? `LKR ${license.price}` : "N/A",
        license.validity || "1 Year",
        features
      ];
  
      tableRows.push(licenseData);
    });
  
    // Add table to PDF with borders
    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid', // Grid theme for a table with borders
      tableLineWidth: 0.5, // Table line width
    });
  
    doc.save("license_details.pdf");
  };
    

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this license?")) return;

    try {
      await axios.delete(`http://localhost:5001/license/delete/${id}`);
      setLicenses((prevLicenses) => prevLicenses.filter((license) => license.id !== id));
    } catch (error) {
      console.error("Error deleting license:", error);
      alert("Failed to delete license.");
    }
  };

  const handleEdit = (licenseId) => {
    const licenseToEdit = licenses.find((l) => l._id === licenseId);
    if (licenseToEdit) {
      setEditingLicense(licenseToEdit);
      setShowForm(true);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:5001/license/update/${id}`, updatedData);
      const response = await axios.get("http://localhost:5001/license/get");
      setLicenses(response.data);
      setShowForm(false);
      setEditingLicense(null);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update license.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 fixed h-full bg-white shadow-md z-10">
        <NavigationBar />
      </div>
      <div className="flex-1 pl-64 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">

          {/* Search Bar & Export Button */}
          <div className="mb-6 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 pl-50">
            <input
              type="text"
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search licenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={exportToPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors"
            >
              Export as PDF
            </button>
          </div>
          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-50">
            {filteredLicenses.length > 0 ? (
              filteredLicenses.map((license) => (
                <LicenseCardAdmin
                  key={license._id}
                  id={license._id}
                  title={license.licenseName || "No title"}
                  description={license.title || "No description"}
                  price={license.price ? `LKR ${license.price}` : "N/A"}
                  validity={license.validity || "1 Year"}
                  features={
                    Array.isArray(license.description)
                      ? license.description
                      : license.description
                        ? license.description.split(/,\s*/)
                        : ["No features listed"]
                  }
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <div className="col-span-3 py-12 text-center">
                <p className="text-gray-500">No licenses found for "{searchTerm}".</p>
              </div>
            )}
          </div>

          {/* Add License Form */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-100">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  onClick={() => setShowForm(false)}
                >
                  ✕
                </button>
                <LicenseForm />
              </div>
            </div>
          )}

          {editingLicense && showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-100">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  onClick={() => setShowForm(false)}
                >
                  ✕
                </button>
                <UpdateLicenseForm
                  licenseData={editingLicense}
                  onUpdate={handleUpdate}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          )}

          {/* Add License Button */}
          <div className="mt-8 flex justify-center w-full pl-56 pr-6">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors shadow-sm w-full"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Close Form" : "Add License"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

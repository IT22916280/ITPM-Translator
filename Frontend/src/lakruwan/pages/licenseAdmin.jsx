import React, { useEffect, useState } from "react";
import axios from "axios";
import LicenseCardAdmin from "../component/licenseCardAdmin";
import NavigationBar from "../../Admin/NavigationBar";
import LicenseForm from "../component/licenseForm";

// const licenseData = [
//     { 
//         id: 1, 
//         title: "Basic Translator", 
//         description: "Translate up to 10 words per day with essential language support.", 
//         price: "$29/year", 
//         validity: "1 Year", 
//         features: ["10 words per day", "Basic language support", "Limited access to AI models"] 
//     },
//     { 
//         id: 2, 
//         title: "Advanced Translator", 
//         description: "Get access to 50 words per day, expanded language support", 
//         price: "$59/year", 
//         validity: "1 Year", 
//         features: ["50 words per day", "Expanded language support", "Priority AI-enhanced translations"] 
//     },
//     { 
//         id: 3, 
//         title: "Ultimate Translator", 
//         description: "Unlimited translations with full access to all supported languages", 
//         price: "$99/year", 
//         validity: "1 Year", 
//         features: ["Unlimited translations", "Full language support", "Instant processing"] 
//     }
// ];

export default function LicenseAdmin() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:5001/license/get");
      if (response.data && Array.isArray(response.data)) {
        setFeedbacks(response.data);
      } else {
        setError("Invalid data format received.");
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };
  fetchFeedbacks();
}, []);

  console.log("CHECK",feedbacks)
  return (
    <div className="flex container">
    <div>
      <NavigationBar></NavigationBar>
        {/* <h1 className="h1-style text-center">Upgrade to unleash everything</h1>
        <p className="mb-4 text-center  text-md text-gray-500 pt-4 pb-6"> 
            Select a translation plan that fits your needs. Whether you need basic daily translations or unlimited access with advanced AI support, our plans provide the right balance of features and affordability. Purchase your license today and start translating with ease
        </p>         */}
    </div>

    <div className="flex flex-col p-6">
      <div>
        <div className="flex max-w-[61%]">
            <div className="flex justify-center gap-6 p-6">
            {feedbacks && feedbacks.length > 0 ? (
                feedbacks
                .map((license) => (
                <LicenseCardAdmin
                    key={license.id}
                    title={license.licenseName || "No title"}
                    description={license.title || "No description"}
                    price={license.price || "N/A"}
                    validity={license.validity || "1 Year"}
                    features={
                    Array.isArray(license.description)
                        ? license.description
                        : license.description
                        ? license.description.split(", ")
                        : []
                    }
                />
                ))
            ) : (
                <p className="text-center">No licenses available.</p>
            )}
            </div>
        </div>

        {/* Conditionally Render the Form */}
        {showForm && (
            <div className="">
            <LicenseForm />
            </div>
        )}

        {/* Button to Show Form */}
        <div className="mt-6">
            <button 
            className="bg-blue-500 w-[97%] text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={() => setShowForm(!showForm)}
            >
            {showForm ? "Close Form" : "Add License"}
            </button>
        </div>
      </div>
    </div>
    </div>
  )
}
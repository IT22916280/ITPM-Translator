import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../lakruwan/component/header";
import { jwtDecode } from "jwt-decode";

export default function SavedTranslations() {
    const [translations, setTranslations] = useState([]);
    const [docID, setDocID] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    console.log("User Name is : ", (decodedToken.userName));

    const userName = decodedToken
    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5001/allTranslations/${userName}`
                );
                setTranslations(response.data.AllTranslations);
                setDocID(response.data.documentId);
                console.log("Translations:", response.data.documentId);
            } catch (error) {
                console.error("Error fetching translations:", error);
            }
        };

        fetchTranslations();
    }, []);

    const handleDelete = async (index) => {
        try {
            // Make the DELETE request with both ID and index
            await axios.delete(`http://localhost:5001/deleteSavedTranslation/${docID}/${index}`);

            alert("Translation deleted successfully!");
            window.location.reload()
            // Update the state to remove the deleted translation
            setTranslations(translations.filter((translation) => translation._id !== docID));


        } catch (error) {
            console.error("Error deleting translation:", error);
            alert("Failed to delete translation.");
        }
    };


    console.log("Document ID :", docID);

    const handleEdit = (index) => {
        navigate(`/updateTranslationPage/${docID}/${index}`);
    };

    const handleGoBack = () => {
        navigate(`/Translator/pg`); // Navigate back to TranslationPage
    };

    return (
        <div className="min-h-screen w-screen p-4 pr-15">
          <Header></Header>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-center">Saved Translations</h2>
              <button
                onClick={handleGoBack}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-1 cursor-pointer"
              >
                Go Back
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-200">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                    >
                      Input
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-black tracking-wider"
                    >
                      Output
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {translations.map((translation, index) => (
                    <tr key={translation._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {translation.english}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {translation.sinhala}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(index)} // Correct ID should be here
                            className="bg-green-700 text-white py-1 px-3 rounded-md hover:bg-green-800"
                            aria-label="Edit Translation"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                            aria-label="Remove Translation"
                          >
                            Remove
                          </button>
                        </div>
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

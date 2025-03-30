import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../lakruwan/component/header";
import { jwtDecode } from "jwt-decode";

export default function SavedTranslations() {
    const [translations, setTranslations] = useState([]);
    const [docID, setDocID] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTranslation, setCurrentTranslation] = useState({ index: null, english: "", sinhala: "" });
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    console.log("User Name is : ", (decodedToken.userName));

    const userName = decodedToken.userName;
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

    const handleEdit = async (index) => {
      try {
          const response = await axios.get(`http://localhost:5001/allTranslations/${docID}/${index}`);
          const { savedtranslation } = response.data;

          // Open the modal with the current translation data
          setCurrentTranslation({ index, english: savedtranslation.english, sinhala: savedtranslation.sinhala });
          setIsModalOpen(true);
      } catch (error) {
          console.error("Error fetching translation:", error);
          alert("Failed to fetch translation.");
      }
  };

  const handleUpdate = async () => {
    const { index, english, sinhala } = currentTranslation;

    if (!english || !sinhala) {
        alert("Both English and Sinhala translations are required.");
        return;
    }

    try {
        await axios.patch(`http://localhost:5001/updateTranslation/${docID}/${index}`, {
            savedtranslation: [{ english, sinhala }],
        });

        alert("Translation updated successfully!");

        // Update the state to reflect the changes
        const updatedTranslations = [...translations];
        updatedTranslations[index] = { ...updatedTranslations[index], english, sinhala };
        setTranslations(updatedTranslations);

        // Close the modal
        setIsModalOpen(false);
    } catch (error) {
        console.error("Error updating translation:", error);
        alert("Failed to update translation.");
    }
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
                            className="bg-blue-400 text-white py-1 px-3 rounded-md hover:bg-blue-500"
                            aria-label="Edit Translation"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="bg-gray-400 text-white py-1 px-3 rounded-md hover:bg-gray-600"
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

          {/* Modal for editing translation */}
          {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Translation</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">English</label>
                            <input
                                type="text"
                                value={currentTranslation.english}
                                onChange={(e) =>
                                    setCurrentTranslation({ ...currentTranslation, english: e.target.value })
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Sinhala</label>
                            <input
                                type="text"
                                value={currentTranslation.sinhala}
                                onChange={(e) =>
                                    setCurrentTranslation({ ...currentTranslation, sinhala: e.target.value })
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      );
}

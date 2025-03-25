import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

export default function AddEngPolisymous() {
    const [engWord, setEngWord] = useState("");
    const [poliEngWMeanings, setpoliEngWMeanings] = useState([""]);
    const [sinhalaWord, setsinhalaWord] = useState([""]);
    const [entries, setEntries] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isAdding, setIsAdding] = useState(false);


    const [reload, setReload] = useState(false);

const handleReload = () => {
    setReload(!reload); // Toggle state to trigger a re-render
};


    // Fetch existing entries (READ)
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await axios.get("http://localhost:5001/poliengwords");
                const validatedEntries = response.data.data.map(entry => ({
                    ...entry,
                    poliEngWMeanings: entry.poliEngWMeanings || [],
                    sinhalaWord: entry.sinhalaWord || []
                }));
                setEntries(validatedEntries);
                console.log("The existing words:", validatedEntries);
            } catch (error) {
                console.error("Error fetching English ambiguous words:", error);
            }
        };
    
        fetchEntries();
    }, [reload]); // Add reload here
    

    const handleSameEngWordChange = (index, event) => {
        const newpoliEngWMeanings = [...poliEngWMeanings];
        newpoliEngWMeanings[index] = event.target.value;
        setpoliEngWMeanings(newpoliEngWMeanings);
    };

    const handleSinambiWordChange = (index, event) => {
        const newsinhalaWord = [...sinhalaWord];
        newsinhalaWord[index] = event.target.value;
        setsinhalaWord(newsinhalaWord);
    };

    const handleAddSameEngField = () => {
        setpoliEngWMeanings([...poliEngWMeanings, ""]);
    };

    const handleAddSinambiField = () => {
        setsinhalaWord([...sinhalaWord, ""]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const newWord = { engWord, poliEngWMeanings, sinhalaWord };
    
        if (editingIndex === null) {
            try {
                const response = await axios.post("http://localhost:5001/insertpoliengword", newWord);
                alert("Added successfully!");
                handleReload(); // Trigger a reload here
            } catch (error) {
                console.error("Error adding English ambiguous word:", error);
                alert("Failed to add.");
            }
        } else {
            try {
                const response = await axios.put(
                    `http://localhost:5001/updatepoliengword/${entries[editingIndex]._id}`,
                    newWord
                );
                alert("Updated successfully!");
                handleReload(); // Trigger a reload here
            } catch (error) {
                console.error("Error updating English ambiguous word:", error);
                alert("Failed to update.");
            }
        }
    
        // Clear form
        setEngWord("");
        setpoliEngWMeanings([""]);
        setsinhalaWord([""]);
        setIsAdding(false);
    };
    

    const handleEdit = (index) => {
        setEngWord(entries[index].engWord);
        setpoliEngWMeanings(entries[index].poliEngWMeanings || []);
        setsinhalaWord(entries[index].sinhalaWord || []);
        setEditingIndex(index);
        setIsAdding(true);
        handleReload(); // Trigger a re-render here
    };

    const handleDelete = async (id, index) => {
        try {
            await axios.delete(`http://localhost:5001/deletepoliengword/${id}`);
            setEntries(entries.filter((_, i) => i !== index));
            alert("Deleted successfully!");
        } catch (error) {
            console.error("Error deleting English ambiguous word:", error);
            alert("Failed to delete.");
        }
    };

    const toggleAddForm = () => {
        setIsAdding(!isAdding);
        setEngWord("");
        setpoliEngWMeanings([""]);
        setsinhalaWord([""]);
        setEditingIndex(null);
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6">
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8 max-w-4xl w-full">
                <h2 className="text-3xl font-bold text-green-700 mb-6">Manage English Polisymous Words</h2>
                <div className="flex justify-end mb-4">
                    <button
                        onClick={toggleAddForm}
                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                        <FaPlus className="mr-2" />
                        {isAdding ? "Cancel" : "Add"}
                    </button>
                </div>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-green-500 text-white">
                            <th className="p-2 border">English Word</th>
                            <th className="p-2 border">Polisymous English Meaning</th>
                            <th className="p-2 border">Sinhala Word</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length > 0 ? (
                            entries.map((entry, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-2 border">{entry.engWord}</td>
                                    <td className="p-2 border">
                                        {Array.isArray(entry.poliEngWMeanings) ? entry.poliEngWMeanings.join(", ") : "No meanings available"}
                                    </td>
                                    <td className="p-2 border">
                                        {Array.isArray(entry.sinhalaWord) ? entry.sinhalaWord.join(", ") : "No words available"}
                                    </td>
                                    <td className="p-2 border">
                                        <button
                                            className="bg-emerald-500 text-white px-5 py-1 rounded-lg hover:bg-emerald-600"
                                            onClick={() => handleEdit(index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-rose-500 text-white px-5 py-1 rounded-lg hover:bg-rose-600"
                                            onClick={() => handleDelete(entry._id, index)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-2 text-center">No entries found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {isAdding && (
                    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">English Word</label>
                            <input
                                type="text"
                                value={engWord}
                                onChange={(e) => setEngWord(e.target.value)}
                                required
                                className="w-full p-3 border border-green-500 rounded-lg"
                                placeholder="Enter English word"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Polisymous English Meanings</label>
                            {poliEngWMeanings.map((word, index) => (
                                <div key={index} className="flex items-center mb-3">
                                    <input
                                        type="text"
                                        value={word}
                                        onChange={(e) => handleSameEngWordChange(index, e)}
                                        required
                                        className="w-full p-3 border border-green-500 rounded-lg"
                                        placeholder={`Enter same English word ${index + 1}`}
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddSameEngField}
                                className="flex items-center text-green-500 font-semibold"
                            >
                                <FaPlus className="mr-2" /> Add Another Word
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Sinhala Words</label>
                            {sinhalaWord.map((word, index) => (
                                <div key={index} className="flex items-center mb-3">
                                    <input
                                        type="text"
                                        value={word}
                                        onChange={(e) => handleSinambiWordChange(index, e)}
                                        required
                                        className="w-full p-3 border border-green-500 rounded-lg"
                                        placeholder={`Enter Sinhala ambiguous word ${index + 1}`}
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddSinambiField}
                                className="flex items-center text-green-500 font-semibold"
                            >
                                <FaPlus className="mr-2" /> Add Another Word
                            </button>
                        </div>
                        <button
 
                type="submit"
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
              >
                {editingIndex === null ? "Add Entry" : "Update Entry"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
}

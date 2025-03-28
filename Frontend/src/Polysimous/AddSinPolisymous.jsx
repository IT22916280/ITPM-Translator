import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

export default function AddSinPolysemous() {
    const [sinWord, setSinWord] = useState("");
    const [PoliSinWMeanings, setPoliSinWMeanings] = useState([""]);
    const [engWord, setEngWord] = useState([""]);
    const [entries, setEntries] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [reload, setReload] = useState(false);

    const handleReload = () => setReload(!reload);

    // Validation Functions
    const validateSinhalaWord = (word) => {
        const sinhalaRegex = /^[\u0D80-\u0DFF\s]+$/;
        if (!word.trim()) return "Sinhala word cannot be empty.";
        if (!sinhalaRegex.test(word)) return "Please enter valid Sinhala characters.";
        if (word.length > 50) return "Sinhala word cannot exceed 50 characters.";
        return "";
    };

    const validatePolyMeanings = (meanings) => {
        if (meanings.length === 0) return "At least one Sinhala meaning is required.";
        const duplicates = meanings.filter((item, index) => meanings.indexOf(item) !== index);
        if (duplicates.length > 0) return "Meanings must be unique.";
        if (meanings.length > 10) return "You can only add up to 10 meanings.";
        for (let meaning of meanings) {
            if (!meaning.trim()) return "Meaning cannot be empty.";
        }
        return "";
    };

    const validateEnglishWords = (words) => {
        if (words.length === 0) return "At least one English word is required.";
        const duplicates = words.filter((item, index) => words.indexOf(item) !== index);
        if (duplicates.length > 0) return "English words must be unique.";
        if (words.length > 10) return "You can only add up to 10 English words.";
        for (let word of words) {
            if (!word.trim()) return "English word cannot be empty.";
            if (!/^[a-zA-Z\s]+$/.test(word)) return "English word can only contain letters and spaces.";
            if (word.length > 50) return "English word cannot exceed 50 characters.";
        }
        return "";
    };

    // Fetch existing entries
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await axios.get("http://localhost:5001/sinpoliwords");
                const validatedEntries = response.data.data.map((entry) => ({
                    ...entry,
                    PoliSinWMeanings: Array.isArray(entry.PoliSinWMeanings) ? entry.PoliSinWMeanings : [],
                    engWord: Array.isArray(entry.engWord) ? entry.engWord : []
                }));
                setEntries(validatedEntries);
            } catch (error) {
                console.error("Error fetching Sinhala ambiguous words:", error);
            }
        };
        fetchEntries();
    }, [reload]);

    const handleAddSameSinField = () => {
        if (PoliSinWMeanings.length < 10) {
            setPoliSinWMeanings([...PoliSinWMeanings, ""]);
        } else {
            alert("You can only add up to 10 meanings.");
        }
    };

    const handleAddEngambiField = () => {
        if (engWord.length < 10) {
            setEngWord([...engWord, ""]);
        } else {
            alert("You can only add up to 10 English words.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        const sinWordError = validateSinhalaWord(sinWord);
        const polyMeaningsError = validatePolyMeanings(PoliSinWMeanings);
        const englishWordsError = validateEnglishWords(engWord);

        if (sinWordError || polyMeaningsError || englishWordsError) {
            alert(`${sinWordError}\n${polyMeaningsError}\n${englishWordsError}`);
            return;
        }

        const newWord = { sinWord, PoliSinWMeanings, engWord };

        if (editingIndex === null) {
            try {
                await axios.post("http://localhost:5001/insertsinpoliword", newWord);
                alert("Added successfully!");
                handleReload();
            } catch (error) {
                console.error("Error adding Sinhala ambiguous word:", error);
                alert("Failed to add.");
            }
        } else {
            try {
                await axios.put(`http://localhost:5001/updatepolisinword/${entries[editingIndex]._id}`, newWord);
                alert("Updated successfully!");
                handleReload();
            } catch (error) {
                console.error("Error updating Sinhala ambiguous word:", error);
                alert("Failed to update.");
            }
        }

        // Clear form
        setSinWord("");
        setPoliSinWMeanings([""]);
        setEngWord([""]);
        setIsAdding(false);
    };

    const handleEdit = (index) => {
        setSinWord(entries[index].sinWord);
        setPoliSinWMeanings(entries[index].PoliSinWMeanings || []);
        setEngWord(entries[index].engWord || []);
        setEditingIndex(index);
        setIsAdding(true);
    };

    const confirmDelete = (id, index) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            handleDelete(id, index);
        }
    };

    const handleDelete = async (id, index) => {
        try {
            await axios.delete(`http://localhost:5001/deletepolisinword/${id}`);
            setEntries(entries.filter((_, i) => i !== index));
            alert("Deleted successfully!");
            handleReload();
        } catch (error) {
            console.error("Error deleting Sinhala ambiguous word:", error);
            alert("Failed to delete.");
        }
    };

    const toggleAddForm = () => {
        setIsAdding(!isAdding);
        setSinWord("");
        setPoliSinWMeanings([""]);
        setEngWord([""]);
        setEditingIndex(null);
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6">
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8 max-w-4xl w-full">
                <h2 className="text-3xl font-bold text-green-700 mb-6">Manage Sinhala Polysemous Words</h2>
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
                            <th className="p-2 border">Sinhala Word</th>
                            <th className="p-2 border">Sinhala Polysemous Meanings</th>
                            <th className="p-2 border">English Words</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length > 0 ? (
                            entries.map((entry, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-2 border">{entry.sinWord}</td>
                                    <td className="p-2 border">{entry.PoliSinWMeanings.join(", ") || "No meanings available"}</td>
                                    <td className="p-2 border">{entry.engWord.join(", ") || "No words available"}</td>
                                    <td className="p-2 border space-x-4">
                                        <button
                                            className="bg-emerald-500 text-white px-5 py-1 rounded-lg hover:bg-emerald-600"
                                            onClick={() => handleEdit(index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-rose-600 text-white px-5 py-1 rounded-lg hover:bg-rose-700"
                                            onClick={() => confirmDelete(entry._id, index)}
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Sinhala Word</label>
                            <input
                                type="text"
                                value={sinWord}
                                onChange={(e) => setSinWord(e.target.value)}
                                className={`w-full p-3 border rounded-lg ${validateSinhalaWord(sinWord) ? "border-red-500" :                                "border-green-500"} rounded-lg`}
                                placeholder="Enter Sinhala word"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Sinhala Polysemous Meanings</label>
                            {PoliSinWMeanings.map((word, index) => (
                                <div key={index} className="flex items-center mb-3">
                                    <input
                                        type="text"
                                        value={word}
                                        onChange={(e) => {
                                            const newMeanings = [...PoliSinWMeanings];
                                            newMeanings[index] = e.target.value;
                                            setPoliSinWMeanings(newMeanings);
                                        }}
                                        className={`w-full p-3 border rounded-lg ${validatePolyMeanings([word]) ? "border-red-500" : "border-green-500"} focus:outline-none focus:ring-2 focus:ring-green-500`}
                                        placeholder={`Enter Sinhala meaning ${index + 1}`}
                                        required
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddSameSinField}
                                className="flex items-center text-green-500 hover:text-green-600 font-semibold"
                            >
                                <FaPlus className="mr-2" /> Add Another Sinhala Polysemous Meaning
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">English Words</label>
                            {engWord.map((word, index) => (
                                <div key={index} className="flex items-center mb-3">
                                    <input
                                        type="text"
                                        value={word}
                                        onChange={(e) => {
                                            const newWords = [...engWord];
                                            newWords[index] = e.target.value;
                                            setEngWord(newWords);
                                        }}
                                        className={`w-full p-3 border rounded-lg ${validateEnglishWords([word]) ? "border-red-500" : "border-green-500"} focus:outline-none focus:ring-2 focus:ring-green-500`}
                                        placeholder={`Enter English word ${index + 1}`}
                                        required
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddEngambiField}
                                className="flex items-center text-green-500 hover:text-green-600 font-semibold"
                            >
                                <FaPlus className="mr-2" /> Add Another English Word
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                        >
                            {editingIndex !== null ? "Update Word" : "Add Word"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

export default function AddEngPolysemous() {
    const [engWord, setEngWord] = useState("");
    const [poliEngWMeanings, setPoliEngWMeanings] = useState([""]);
    const [sinhalaWord, setSinhalaWord] = useState([""]);
    const [entries, setEntries] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [reload, setReload] = useState(false);

    const handleReload = () => setReload(!reload);

    // Validations
    const validateEngWord = (word) => {
        if (!word.trim()) return "English word cannot be empty.";
        if (word.length > 50) return "English word cannot exceed 50 characters.";
        if (!/^[a-zA-Z\s]+$/.test(word)) return "English word can only contain letters and spaces.";
        return "";
    };

    const validatePolyMeanings = (meanings) => {
        if (meanings.length === 0) return "At least one polysemous meaning is required.";
        const duplicates = meanings.filter((item, index) => meanings.indexOf(item) !== index);
        if (duplicates.length > 0) return "Polysemous meanings must be unique.";
        for (let meaning of meanings) {
            if (!meaning.trim()) return "Meanings cannot be empty.";
        }
        if (meanings.length > 10) return "You can only add up to 10 meanings.";
        return "";
    };

    const validateSinhalaWords = (words) => {
        const sinhalaRegex = /^[\u0D80-\u0DFF\s]+$/;
        if (words.length === 0) return "At least one Sinhala word is required.";
        const duplicates = words.filter((item, index) => words.indexOf(item) !== index);
        if (duplicates.length > 0) return "Sinhala words must be unique.";
        for (let word of words) {
            if (!word.trim()) return "Sinhala words cannot be empty.";
            if (!sinhalaRegex.test(word)) return "Sinhala words must contain valid Sinhala characters.";
        }
        if (words.length > 10) return "You can only add up to 10 Sinhala words.";
        return "";
    };

    // Fetch existing entries
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await axios.get("http://localhost:5001/poliengwords");
                const validatedEntries = response.data.data.map((entry) => ({
                    ...entry,
                    poliEngWMeanings: entry.poliEngWMeanings || [],
                    sinhalaWord: entry.sinhalaWord || []
                }));
                setEntries(validatedEntries);
            } catch (error) {
                console.error("Error fetching English ambiguous words:", error);
            }
        };
        fetchEntries();
    }, [reload]);

    const handleAddSameEngField = () => {
        if (poliEngWMeanings.length < 10) {
            setPoliEngWMeanings([...poliEngWMeanings, ""]);
        } else {
            alert("You can only add up to 10 meanings.");
        }
    };

    const handleAddSinambiField = () => {
        if (sinhalaWord.length < 10) {
            setSinhalaWord([...sinhalaWord, ""]);
        } else {
            alert("You can only add up to 10 Sinhala words.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        const engWordError = validateEngWord(engWord);
        const polyMeaningsError = validatePolyMeanings(poliEngWMeanings);
        const sinhalaWordsError = validateSinhalaWords(sinhalaWord);

        if (engWordError || polyMeaningsError || sinhalaWordsError) {
            alert(`${engWordError}\n${polyMeaningsError}\n${sinhalaWordsError}`);
            return;
        }

        const newWord = { engWord, poliEngWMeanings, sinhalaWord };

        if (editingIndex === null) {
            try {
                await axios.post("http://localhost:5001/insertpoliengword", newWord);
                alert("Added successfully!");
                handleReload();
            } catch (error) {
                console.error("Error adding English ambiguous word:", error);
                alert("Failed to add.");
            }
        } else {
            try {
                await axios.put(
                    `http://localhost:5001/updatepoliengword/${entries[editingIndex]._id}`,
                    newWord
                );
                alert("Updated successfully!");
                handleReload();
            } catch (error) {
                console.error("Error updating English ambiguous word:", error);
                alert("Failed to update.");
            }
        }

        // Clear form
        setEngWord("");
        setPoliEngWMeanings([""]);
        setSinhalaWord([""]);
        setIsAdding(false);
    };

    const handleEdit = (index) => {
        setEngWord(entries[index].engWord);
        setPoliEngWMeanings(entries[index].poliEngWMeanings || []);
        setSinhalaWord(entries[index].sinhalaWord || []);
        setEditingIndex(index);
        setIsAdding(true);
    };

    const confirmDeletion = (id, index) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            handleDelete(id, index);
        }
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
        setPoliEngWMeanings([""]);
        setSinhalaWord([""]);
        setEditingIndex(null);
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6">
            <div className="border-2 border-gray-300 rounded-lg shadow-lg p-8 max-w-4xl w-full">
                <h2 className="text-3xl font-medium text-gray-700 mb-6">Manage English Polysemous Words</h2>
                <div className="flex justify-end mb-4">
                    <button
                        onClick={toggleAddForm}
                        className="flex items-center bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        <FaPlus className="mr-2" />
                        {isAdding ? "Cancel" : "Add"}
                    </button>
                </div>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-blue-200 text-gray-800">
                            <th className="p-2 border border-blue-400">English Word</th>
                            <th className="p-2 border border-blue-400">Polysemous English Meanings</th>
                            <th className="p-2 border border-blue-400">Sinhala Word</th>
                            <th className="p-2 border border-blue-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length > 0 ? (
                            entries.map((entry, index) => (
                                <tr key={index} className="border-b border-blue-400">
                                    <td className="p-2 border border-blue-400">{entry.engWord}</td>
                                    <td className="p-2 border border-blue-400">
                                        {Array.isArray(entry.poliEngWMeanings) ? entry.poliEngWMeanings.join(", ") : "No meanings available"}
                                    </td>
                                    <td className="p-2 border border-blue-400">
                                        {Array.isArray(entry.sinhalaWord) ? entry.sinhalaWord.join(", ") : "No words available"}
                                    </td>
                                    <td className="p-2 flex flex-col gap-1">
                                        <button
                                            className="w-full bg-blue-400 text-white px-5 py-1 rounded-lg hover:bg-blue-600"
                                            onClick={() => handleEdit(index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="w-full bg-gray-400 text-white px-5 py-1 rounded-lg hover:bg-gray-500"
                                            onClick={() => confirmDeletion(entry._id, index)}
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
                                className="w-full p-3 border border-blue-500 rounded-lg"
                                placeholder="Enter English word"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Polysemous English Meanings</label>
                            {poliEngWMeanings.map((word, index) => (
                                <div key={index} className="flex items-center mb-3">
                                    <input
                                        type="text"
                                        value={word}
                                        onChange={(e) => {
                                            const newMeanings = [...poliEngWMeanings];
                                            newMeanings[index] = e.target.value;
                                            setPoliEngWMeanings(newMeanings);
                                        }}
                                        className="w-full p-3 border border-blue-500 rounded-lg"
                                        placeholder={`Enter meaning ${index + 1}`}
                                        required
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddSameEngField}
                                className="flex items-center text-blue-500 font-semibold"
                            >
                                <FaPlus className="mr-2" /> Add Another Meaning
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Sinhala Words</label>
                            {sinhalaWord.map((word, index) => (
                                <div key={index} className="flex items-center mb-3">
                                    <input
                                        type="text"
                                        value={word}
                                        onChange={(e) => {
                                            const newWords = [...sinhalaWord];
                                            newWords[index] = e.target.value;
                                            setSinhalaWord(newWords);
                                        }}
                                        className="w-full p-3 border border-blue-500 rounded-lg"
                                        placeholder={`Enter Sinhala word ${index + 1}`}
                                        required
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddSinambiField}
                                className="flex items-center text-blue-500 font-semibold"
                            >
                                <FaPlus className="mr-2" /> Add Another Word
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                        >
                            {editingIndex === null ? "Add Entry" : "Update Entry"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
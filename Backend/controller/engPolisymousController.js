const mongoose = require("mongoose");
const polisyEngmodel = require("../models/englishPolysemousWords");

// Insert words
const insertEngPolisymous = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Invalid data provided" });
        }

        const newEngPoliWrd = new polisyEngmodel(req.body);
        await newEngPoliWrd.save();
        res.status(201).json({ message: 'English Polysemous word created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create English polysemous word' });
    }
};

// Get all words
const getAllEngPoliWrds = async (req, res) => {
    try {
        const EngPoliWrds = await polisyEngmodel.find();

        if (EngPoliWrds.length === 0) {
            return res.status(200).json({
                message: "No English polysemous words found",
                data: []
            });
        }
        res.status(200).json({
            message: 'English polysemous words fetched successfully',
            data: EngPoliWrds
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch English polysemous words" });
    }
};

// Fetch by ID
const getEngPoliWrdById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID provided" });
    }

    try {
        const EngPoliWrd = await polisyEngmodel.findById(id);

        if (!EngPoliWrd) {
            return res.status(404).json({ message: "Couldn't find the English polysemous word" });
        }
        res.status(200).json({
            message: `${id}'s English polysemous word data fetched`,
            data: EngPoliWrd
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch English polysemous word" });
    }
};

// Update by ID
const updateEngPoliWrdById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID provided" });
    }

    try {
        const updateEngPoliWrd = await polisyEngmodel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updateEngPoliWrd) {
            return res.status(404).json({ message: "Couldn't find the English polysemous word" });
        }
        res.status(200).json({
            message: `${id}'s English polysemous word data updated successfully`,
            data: updateEngPoliWrd
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update English polysemous word" });
    }
};

// Delete by ID
const deleteEngPoliWrdById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID provided" });
    }

    try {
        const deleteEngPoliWrd = await polisyEngmodel.findByIdAndDelete(id);

        if (!deleteEngPoliWrd) {
            return res.status(404).json({ message: "Couldn't find the English polysemous word" });
        }
        res.status(200).json({
            message: `${id}'s English polysemous word data deleted successfully`,
            data: deleteEngPoliWrd
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete English polysemous word" });
    }
};

module.exports = {
    insertEngPolisymous,
    getAllEngPoliWrds,
    getEngPoliWrdById,
    updateEngPoliWrdById,
    deleteEngPoliWrdById
};
const express = require("express");
const router = express.Router();
const License = require("../models/LicenseModel");

// Create a new license
router.post("/license", async (req, res) => {
  try {
    const { licenseName, title, description, price, isTrial } = req.body;
    const newLicense = new License({ licenseName, title, description, price, isTrial });
    await newLicense.save();
    res.status(201).json(newLicense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all licenses
router.get("/license", async (req, res) => {
  try {
    const licenses = await License.find();
    res.json(licenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific license by ID
router.get("/license/:id", async (req, res) => {
  try {
    const license = await License.findById(req.params.id);
    if (!license) return res.status(404).json({ message: "License not found" });
    res.json(license);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a license
router.put("/license/:id", async (req, res) => {
  try {
    const updatedLicense = await License.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedLicense) return res.status(404).json({ message: "License not found" });
    res.json(updatedLicense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a license
router.delete("/license/:id", async (req, res) => {
  try {
    const deletedLicense = await License.findByIdAndDelete(req.params.id);
    if (!deletedLicense) return res.status(404).json({ message: "License not found" });
    res.json({ message: "License deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const license = require("../models/license.model");

const licensePost = async (req, res) => {
  try {
    const { licenseName, title, description, price, isEnabled } = req.body;
    const newLicense = new license({ licenseName, title, description, price, isEnabled });
    await newLicense.save();
    res.status(201).json(newLicense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const licenseGet = async (req, res) => {
    try {
      const licenses = await license.find();
      res.json(licenses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

const licenstGetById = async (req, res) => {
  try {
    const license = await license.findById(req.params.id);
    if (!license) return res.status(404).json({ message: "License not found" });
    res.json(license);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const licenseUpdateById = async (req, res) => {
  try {
    const updatedLicense = await license.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedLicense) return res.status(404).json({ message: "License not found" });
    res.json(updatedLicense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const licenseDeleteById = async (req, res) => {
    try {
      const deletedLicense = await license.findByIdAndDelete(req.params.id);
      if (!deletedLicense) return res.status(404).json({ message: "License not found" });
      res.json({ message: "License deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  module.exports = {
    licensePost,
    licenseGet,
    licenstGetById,
    licenseUpdateById,
    licenseDeleteById
}
const savedTranslationsModel = require("../models/savedTranslations.model");

// Input translations (handles multiple translations)
const inputTranslation = async (req, res) => {
  const { username, savedtranslation } = req.body; // Expecting an array of translations

  try {
    // Validate that username and savedtranslation are present
    if (!username || !savedtranslation || !Array.isArray(savedtranslation) || savedtranslation.length === 0) {
      return res.status(400).send({
        message: "Username and a non-empty array of translations are required.",
      });
    }

    // Validate that each translation object contains both english and sinhala
    for (const translation of savedtranslation) {
      if (!translation.english || !translation.sinhala) {
        return res.status(400).send({
          message: "Each translation must have both English and Sinhala fields.",
        });
      }
    }

    // Find the user's saved translations
    let userTranslations = await savedTranslationsModel.findOne({ username });

    if (!userTranslations) {
      // If no record exists, create a new one
      userTranslations = new savedTranslationsModel({
        username,
        savedtranslation,
      });
    } else {
      // If record exists, add the new translations to the savedtranslation array
      userTranslations.savedtranslation.push(...savedtranslation);
    }

    // Save the updated translations
    const savedTranslation = await userTranslations.save();
    res.status(200).send({
      message: "Translations saved successfully!",
      data: savedTranslation,
    });
  } catch (err) {
    console.error("Translation input error:", err.message);
    res.status(500).send({ message: "An error occurred while saving translations." });
  }
};

// Get all saved translations for a user
const getAllTranslations = async (req, res) => {
    const { username } = req.params;
  
    try {
      const userTranslations = await savedTranslationsModel.findOne({ username });
  
      if (!userTranslations) {
        return res.status(404).json({
          status: false,
          message: "No saved translations found for the user.",
        });
      }
  
      return res.status(200).json({
        status: true,
        documentId: userTranslations._id,
        AllTranslations: userTranslations.savedtranslation,
      });
    } catch (error) {
      console.error("Error fetching saved translations:", error);
      return res.status(500).json({ status: false, message: "Server error." });
    }
  };

// Get a specific saved translation by ID
const getTranslationById = async (req, res) => {
    const { id, index } = req.params; // Assuming the request includes both the document ID and the index of the array item
  
    try {
      // Fetch the document by its ID
      const translationDoc = await savedTranslationsModel.findById(id);
  
      if (!translationDoc) {
        return res.status(404).json({ message: "Translation document not found" });
      }
  
      // Fetch the specific translation by index
      const translationItem = translationDoc.savedtranslation[index];
  
      if (!translationItem) {
        return res.status(404).json({ message: "Translation not found in the savedtranslation array" });
      }
  
      // Include the document ID along with the translation item
      res.json({ 
        savedtranslation: translationItem,
        documentId: translationDoc._id // Add the document ID here
      });
    } catch (error) {
      console.error("Error fetching translation:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  

// Delete a saved translation
const deleteSavedTranslations = async (req, res) => {
    const { id, index } = req.params; // Retrieve both ID and index from the URL parameters
  
    try {
      // Find the document by ID
      const savedTranslationDocument = await savedTranslationsModel.findById(id);
      
      if (!savedTranslationDocument) {
        return res.status(404).send({
          status: false,
          message: "Translation document not found!",
        });
      }
  
      // Check if the index is valid
      if (index < 0 || index >= savedTranslationDocument.savedtranslation.length) {
        return res.status(400).send({
          status: false,
          message: "Invalid index provided!",
        });
      }
  
      // Remove the translation at the specified index
      savedTranslationDocument.savedtranslation.splice(index, 1);
      
      // Save the updated document
      await savedTranslationDocument.save();
  
      res.status(200).send({
        status: true,
        message: "✨ :: Saved Translation Deleted!",
      });
    } catch (err) {
      return res.status(500).send({
        status: false,
        message: err.message,
      });
    }
  };
  

// Update a saved translation
const updateTranslation = async (req, res) => {
    const { id, index } = req.params; // Document ID and index of the translation
    const { savedtranslation } = req.body; // Expecting an array of translation objects
  
    try {
      // Check if the savedtranslation array is provided and is not empty
      if (!savedtranslation || !Array.isArray(savedtranslation) || savedtranslation.length === 0) {
        return res.status(400).send({
          status: false,
          message: "A non-empty array of translations is required.",
        });
      }
  
      // Validate that each translation object contains both english and sinhala
      const { english, sinhala } = savedtranslation[0]; // Assuming you want to update the first translation object
      if (english === undefined || sinhala === undefined) {
        return res.status(400).send({
          status: false,
          message: "Both English and Sinhala fields are required.",
        });
      }
  
      // Find the translation document by ID
      const translationDoc = await savedTranslationsModel.findById(id);
      if (!translationDoc) {
        return res.status(404).json({ message: "Translation document not found" });
      }
  
      // Update the specific translation by index
      translationDoc.savedtranslation[index] = { english, sinhala }; // Update the translation at the specified index
  
      // Save the updated document
      await translationDoc.save();
  
      res.status(200).send({
        status: true,
        message: "✨ :: Translation Updated!",
      });
    } catch (err) {
      return res.status(500).send({
        status: false,
        message: err.message,
      });
    }
  };
  
  
  

module.exports = {
  inputTranslation,
  getAllTranslations,
  getTranslationById,
  deleteSavedTranslations,
  updateTranslation,
};

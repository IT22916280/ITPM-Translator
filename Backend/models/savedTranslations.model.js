const mongoose = require("mongoose");

const TranslationsSchema = mongoose.Schema({
    english: { type: String, required: true, trim: true },
    sinhala: { type: String, required: true, trim: true },
});

const savedTranslationsSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    savedtranslation: [TranslationsSchema],
});

const savedTranslationsModel = mongoose.model("savedTranslation", savedTranslationsSchema);

module.exports = savedTranslationsModel;

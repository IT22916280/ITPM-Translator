const mongoose = require("mongoose");

const LicenseSchema = new mongoose.Schema(
  {
    licenseName: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    isEnabled: { type: Boolean, required: true, default: false },
  },
);

const License = mongoose.model("License", LicenseSchema);
module.exports = License;

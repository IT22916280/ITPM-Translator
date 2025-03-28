const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({

    adminID: {
        type: String,
        required: true,
        trim: true,
    },

    adminName: {
        type: String,
        required: true,
        trim: true,
    },

    adminEmail: {
        type: String,
        required: true,
        trim: true,
    },

    username: {
        type: String,
        required: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        trim: true,
    },

});

module.exports = mongoose.model("Admin",adminSchema);
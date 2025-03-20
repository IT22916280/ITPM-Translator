const mongoose = require("mongoose");

const EngPolisymousSchema = new mongoose.Schema({
    engWord:{
        type:String,
        required:true
    },
    poliEngWMeanings:{
        type: [String],
        required:true
    },
    sinhalaWord:{
        type:[String],
        required:true
    }
});

module.exports =mongoose.model("polisymousENG", EngPolisymousSchema);
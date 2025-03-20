const mongoose = require('mongoose');

const SinPolymousSchema = new mongoose.Schema({
    sinWord:{
        type:String,
        required:true
    },
    PoliSinWMeanings:{
        type:[String],
        required:true
    },
    engWord:{
        type: [String],
        required:true
    }
})

 module.exports =mongoose.model("polisymousSin",SinPolymousSchema);


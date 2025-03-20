const PoliSinmodel = require("../models/sinhalaPolysemousWords");

//insert words
const insertSinPoliwrds = async(req,res) => {
    
    const newSinPoliwrd = new PoliSinmodel(req.body);

    try{
        await newSinPoliwrd.save();

        res.status(200).json({message:"sinhala polisymous word created successfully"})

    }catch(error){
        console.error(error),
        res.status(500).json({message:"Sinhala polisymomus word insert is failed"})
    }
}

//get all words
const getAllSinPoliWrds = async(req,res) =>{
    const SinPoliWrds = await PoliSinmodel.find();

    try{
        if(!SinPoliWrds){
            res.status(404).json({message:"No sinhala polisymous word in there"})
        }

        res.status(200).json({
            message:"All sinhala polisymous words are fetched",
            data:SinPoliWrds
        })

    }catch(error){

        console.error(error),
        res.status(500).json({
            message:"sinhala polisymous words fetching is failed"
        })
    }
}


//get word by id
const getSinPoliWrdById = async(req,res) => {
    const {id} = req.params;

    try{
        const SinPoliWrd = await PoliSinmodel.findById(id);

        if(!SinPoliWrd){
            res.status(404).json({message:"Couldnt find the sinhala polisymous word"})

        }

        res.status(200).json({
            message: `${id} s sinhala olisymous data  fetched`,
            data:SinPoliWrd
        })

    }catch(error) {
        console.error(error),
        res.status(500).json({message:"Sinhala polisymous word ' s Data fetched failed"})
    }
}


//update sinhala wrd by id
const updateSinPoliWrdById = async(req,res) => {
    const {id} = req.params;

    try{
        const updateSinPoliWrd  = await PoliSinmodel.findByIdAndUpdate(id,req.body,{new:true});

        if(!updateSinPoliWrd){
            res.status(404).json({message:"Couldnt find the sinhala polisymous word"})

        }
        res.status(200).json({
            message:`${id} 's sinhala polisymous word Data  successfully updated`,
            data: updateSinPoliWrd
        })

    }catch (error) {
        console.error(error);
        res.status(500).json({message:"Sinhala polisymous word'd data update failed"})
    }
}


//Delete sinhala poli word by ID

const deleteSinPoliWrdById = async(req,res) => {
    const {id} = req.params;

    try{
        const deleteSinPoliWrd = await PoliSinmodel.findByIdAndDelete(id);
    
        if(!deleteSinPoliWrd){
            res.status(404).json({message:"Couldnt find the sinahala polisymous word"})
        }

        res.status(200).json({
            message:`${id} 's sinhala polisymous data successfully deleted`,
            data:deleteSinPoliWrd
        })


    }catch(error){
        res.status(500).json({message:"Sinhala polisymous word's data deleting failed"})
    }
}







module.exports = {
    insertSinPoliwrds,
    getAllSinPoliWrds,
    getSinPoliWrdById,
    updateSinPoliWrdById,
    deleteSinPoliWrdById

}

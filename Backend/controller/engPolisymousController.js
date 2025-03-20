const polisyEngmodel = require("../models/englishPolysemousWords");

//insert words
const insertEngPolisymous = async(req,res) => {

     const newEngPoliWrd = new polisyEngmodel(req.body);
    try{
        await newEngPoliWrd.save();
        res.status(201).json({message:'English Polisymous word create successfully'})  
    }catch (error){
        console.error(error);
        res.status(500).json({message:'English polisymous word creation Failed'})
    }
}

//get all words
const getAllEngPoliWrds = async(req,res) => {
    const EngPoliWrds = await polisyEngmodel.find();

    try{
        if(EngPoliWrds.length === 0){
            res.status(404).json({message:"No English polisymous words found"})
        }
        res.status(200).json({
            message: 'English polisymous words fetched successfully',
            data: EngPoliWrds
        })
    }catch(error){
        console.error(error);
        res.status(500).json({message:"English polisymoums words data fetching is failed"});       
    }

}

//fetched by Id
const getEngPoliWrdById = async(req,res) => {
    const {id} = req.params;

    try{
        const EngPoliWrd = await polisyEngmodel.findById(id);

        if(!EngPoliWrd){
            res.status(404).json({message: "Couldnt find the English Polisymous Word"})
        }
        res.status(200).json({message:`${id} 's English polisymous data fetched`,
        date:EngPoliWrd
        });

    }catch(error){
        console.error(error);
        res.status(500).json({message:"Eng polisymous word is not fetching successfully"});
    }
}

//update by id
const updateEngPoliWrdById = async(req,res) =>{
    const {id} = req.params;

    try{
        const updateEngPoliWrd = await polisyEngmodel.findByIdAndUpdate(id,req.body,{new:true});

        if(!updateEngPoliWrd){
            res.status(404).json({message:"Couldnt find the English polisymous word"})
        }
        res.status(200).json({
            message: `${id} 's English polisymous word Date Successfully Updated`,
            data:updateEngPoliWrd
        })

        }        
        catch(error){
            console.error(error);
            res.status(500).json({message:"English polisymous word's Date update is Failed"})
            
    }
}

//Delete word by Id
const deleteEngPoliWrdById = async(req,res) => {
    const {id}= req.params;

    try{
        const deleteEngPoliWrd = await polisyEngmodel.findByIdAndDelete(id);
        
        if(!deleteEngPoliWrd){
            res.status(404).json({message:"Couldnt find the English polisymous word"})
        }
        res.status(200).json({
            message:`${id} 's English polisymous word Data successfully deleted`,
            data: deleteEngPoliWrd
        })

    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"English polisymous word' s deleting is failed"})
    }
}

module.exports = {
    insertEngPolisymous,
    getAllEngPoliWrds,
    getEngPoliWrdById,
    updateEngPoliWrdById,
    deleteEngPoliWrdById
}


const router = require("express").Router();
const SinPoliCtrl = require('../controller/sinhalaPolisymouswordController');



router.post("/insertsinpoliword",SinPoliCtrl.insertSinPoliwrds);
router.get('/sinpoliwords',SinPoliCtrl.getAllSinPoliWrds);
router.get('/polisinword/:id',SinPoliCtrl.getSinPoliWrdById);
router.put('/updatepolisinword/:id',SinPoliCtrl.updateSinPoliWrdById);
router.delete('/deletepolisinword/:id',SinPoliCtrl.deleteSinPoliWrdById);

module.exports= router;
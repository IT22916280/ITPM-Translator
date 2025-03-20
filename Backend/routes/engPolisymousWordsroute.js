const router = require("express").Router();
const EngPoliCtrl = require('../controller/engPolisymousController');


router.post('/insertpoliengword',EngPoliCtrl.insertEngPolisymous);
router.get('/poliengwords',EngPoliCtrl.getAllEngPoliWrds);
router.get('/poliengword/:id',EngPoliCtrl.getEngPoliWrdById);
router.put('/updatepoliengword/:id',EngPoliCtrl.updateEngPoliWrdById);
router.delete('/deletepoliengword/:id',EngPoliCtrl.deleteEngPoliWrdById);

module.exports = router;
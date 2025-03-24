const savedTranslationsRouter = require("express").Router();
const savedTranslationsCtrl = require("../controller/savedTranslations.controller");

savedTranslationsRouter.post('/inputTranslation', savedTranslationsCtrl.inputTranslation);
savedTranslationsRouter.get('/allTranslations/:username', savedTranslationsCtrl.getAllTranslations);
savedTranslationsRouter.patch('/updateTranslation/:id/:index', savedTranslationsCtrl.updateTranslation);
savedTranslationsRouter.delete('/deleteSavedTranslation/:id/:index', savedTranslationsCtrl.deleteSavedTranslations);


savedTranslationsRouter.get('/allTranslations/:id/:index', savedTranslationsCtrl.getTranslationById);//alter route for fetching

module.exports = savedTranslationsRouter;

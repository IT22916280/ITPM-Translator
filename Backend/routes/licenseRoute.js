const express = require("express");
const router = express.Router();
const licenseController = require('../controller/licenseController')

router.post("/license/post", licenseController.licensePost);
router.get("/license/get", licenseController.licenseGet);
router.get("/license/get/:id", licenseController.licenstGetById);
router.put("/license/update/:id", licenseController.licenseUpdateById);
router.delete("/license/delete/:id", licenseController.licenseDeleteById);

module.exports = router;

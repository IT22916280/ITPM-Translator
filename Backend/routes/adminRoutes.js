const adminrouter= require("express").Router();
const adminCtrl = require('../controller/adminController');


adminrouter.post('/createadmin',adminCtrl.createAdmin);
adminrouter.get('/alladmins',adminCtrl.getAllAdmin);
adminrouter.get('/admin/:id',adminCtrl.getAdminById);
adminrouter.put('/updateadmin/:id',adminCtrl.updateAdminById);
adminrouter.delete('/deleteadmin/:id',adminCtrl.deleteAdminById);
adminrouter.get('/generateAdminReport',adminCtrl.generateAdminReport);


module.exports = adminrouter;
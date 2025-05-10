const userRouter = require("express").Router();

const userCtrl = require("../controller/user.controller");

userRouter.post('/register', userCtrl.registerUser);
userRouter.post('/login', userCtrl.loginUser);
userRouter.post('/dashboard', userCtrl.userDashboard);
userRouter.post('/user/:id',userCtrl.findById);


userRouter.get('/all', userCtrl.getAllUsers);
userRouter.put('/update/:id', userCtrl.updateUser);
userRouter.delete('/delete/:id', userCtrl.deleteUser);

module.exports = userRouter;

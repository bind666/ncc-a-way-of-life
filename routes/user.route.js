import express from 'express';
import { logincadet, loginUser, logout, refreshToken, registerUser } from '../controllers/user.Controller.js';
import { validateLoginUser, validateRegisterUser } from '../middleware/validator.js';
import {auth} from '../middleware/auth.js';

const userRouter = express.Router();

//@Route to register user
userRouter.route('/register').post(validateRegisterUser, registerUser)
userRouter.route('/login').post(validateLoginUser, loginUser)
userRouter.route('/logincadet').post(validateLoginUser, logincadet)

//@protected route
userRouter.route("/refresh").get(refreshToken)

userRouter.route("/logout").delete(auth,logout)

export default userRouter;
import { Router } from "express";
import { changePassword, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/register").post(upload.fields([{ name: 'coverimage', maxCount: 1 }]),registerUser)

router.route("/login").post(loginUser)

//secured routes 

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/changePassword").post(verifyJWT, changePassword)


export default router   
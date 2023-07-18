import dotenv from 'dotenv';
dotenv.config();
import express from "express";
const app = express();
import multer from "multer";
import Controllers from "../controllers/index.js";
const router = express.Router();

// multer image file process
const upload = multer({ dest: 'uploads/' });

// Session setting


router.post('/signin', (req, res)=>{
    Controllers.authController.signIn(req, res);
})

router.get('/signout', (req, res)=>{
    Controllers.authController.signOut(req, res);
})

router.post('/signup', upload.single('avatar'), (req, res)=>{
    Controllers.authController.singUp(req, res);
})

export default router;
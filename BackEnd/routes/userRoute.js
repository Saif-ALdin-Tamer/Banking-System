import { get } from "mongoose";
import express from 'express' ;
import { protect } from '../middleware/authMiddleware.js';
import { getUserData, updateProfile } from
    '../controllers/usersControllers.js'


const router = express.Router()

router.get('/', protect, getUserData ) ;

router.put('/withdraw', protect, updateProfile ) ;

export  default router
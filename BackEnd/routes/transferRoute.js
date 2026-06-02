import express from 'express' ;
import { protect } from '../middleware/authMiddleware.js' ;
import { transfer } from
    '../controllers/transferControllers.js'


const router = express.Router()

router.post('/transfer', protect, transfer ) ;

export  default router
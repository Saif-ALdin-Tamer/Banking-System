import express from 'express' ;
import { protect } from '../middleware/authMiddleware.js' ;
import { createDepositSession, verifyDeposit } from
    '../controllers/depositController.js'

const router = express.Router() ;

router.post('/create', protect, createDepositSession ) ;

router.post('/verify', protect, verifyDeposit ) ;

export  default router
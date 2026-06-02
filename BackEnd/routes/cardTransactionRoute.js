import express from 'express' ;

import { depositToCard, withdrawFromCard,
    getCardBalance, transferToCard, transferToAccount } from
    '../controllers/cardTransactionController.js' ;

import {protect } from '../middleware/authMiddleware.js' ;

const router = express.Router() ;

router.get('/balance',protect, getCardBalance ) ;

router.post('/deposite',protect, depositToCard ) ;

router.post('/withdraw',protect, withdrawFromCard ) ;

router.post('/to-card', protect, transferToCard ) ;

router.post('/to-account', protect, transferToAccount) ;

export default router
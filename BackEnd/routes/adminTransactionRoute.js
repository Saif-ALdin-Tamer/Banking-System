import express from 'express' ;

import { getAllTransaction } from '../controllers/adminTransactionController.js' ;

import {protect } from '../middleware/authMiddleware.js' ;
const router = express.Router() ;

router.get('/',protect, getAllTransaction )

export default router
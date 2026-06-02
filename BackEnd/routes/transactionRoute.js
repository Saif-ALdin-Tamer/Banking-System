import express from 'express' ;
import { protect } from '../middleware/authMiddleware.js' ;
import { deposite, withdraw, getTransaction } from
    '../controllers/transactionController.js'


const router = express.Router()

router.get('/', protect, getTransaction ) ;

router.put('/withdraw', protect, withdraw ) ;

router.post('/deposite', protect, deposite ) ;

export  default router
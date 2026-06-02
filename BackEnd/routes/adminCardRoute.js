import express from 'express' ;
import { protect } from '../middleware/authMiddleware.js'
import { getAllCards, deleteCard } from '../controllers/adminCardControllers.js'

const router = express.Router() ;

router.get('/', protect, getAllCards) ;
router.delete('/:id', protect, deleteCard) ;

export default router
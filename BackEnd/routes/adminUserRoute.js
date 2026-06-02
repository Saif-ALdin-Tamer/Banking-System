import express from 'express' ;

import { getAllUsers, deleteUsers, updateUserBalance } from
    '../controllers/adminUserController.js' ;

import {protect } from '../middleware/authMiddleware.js' ;

const router = express.Router() ;

router.get('/',protect, getAllUsers )


router.put('/:id/balance',protect, updateUserBalance )


router.delete('/:id',protect, deleteUsers )

export default router
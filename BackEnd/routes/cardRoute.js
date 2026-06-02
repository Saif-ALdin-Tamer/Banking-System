import express from 'express' ;

import { createCard, getMyCard } from
    '../controllers/cardController.js' ;

import {protect } from '../middleware/authMiddleware.js' ;

const router = express.Router() ;

router.get('/',protect, getMyCard )


router.post('/:id/balance',protect, createCard )


export default router
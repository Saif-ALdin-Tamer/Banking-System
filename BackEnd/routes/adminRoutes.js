import express from 'express' ;
import { loginAdmin, registerAdmin } from '../controllers/adminController.js' ;
const router = express.Router() ;

router.post('/', loginAdmin ) ;
router.post('/', registerAdmin )

export default router
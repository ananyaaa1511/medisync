const express=require('express');
const router=express.Router();
const {createDoctorProfile,getAllDoctors,getDoctorById,getMyDoctorProfile}=require('../controllers/doctorcontroller');
const protect=require('../middleware/authMiddleware');


router.post('/',protect,createDoctorProfile);
router.get('/',getAllDoctors);
router.get('/me',protect,getMyDoctorProfile);
router.get('/:id',getDoctorById)


module.exports=router;
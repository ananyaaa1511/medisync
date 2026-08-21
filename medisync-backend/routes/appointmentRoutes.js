const express = require('express');
const router = express.Router();
const { 
    bookAppointment, 
    getMyAppointments, 
    cancelAppointment,
    completeAppointment 
} = require('../controllers/appointmentController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);
router.delete('/:id', protect, cancelAppointment);
router.patch('/:id/complete', protect, completeAppointment);

module.exports = router;
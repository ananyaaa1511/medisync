const express = require('express');

const router = express.Router();

const {
    createSlot,
    getSlotByDoctor,
    getMySlot
} = require('../controllers/slotcontroller');

const protect = require('../middleware/authMiddleware');

router.post('/', protect, createSlot);

router.get('/', getSlotByDoctor);

router.get('/mine', protect, getMySlot);

module.exports = router;
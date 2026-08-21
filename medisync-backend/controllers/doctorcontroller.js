const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');

// Create doctor profile (only accessible to logged-in doctors)
const createDoctorProfile = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create a doctor profile' });
    }

    const existingProfile = await Doctor.findOne({ user: req.user.id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Doctor profile already exists' });
    }

    const { specialization, qualification, experienceYears, consultationFee, bio } = req.body;

    const doctor = await Doctor.create({
      user: req.user.id,
      specialization,
      qualification,
      experienceYears,
      consultationFee,
      bio
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all doctors (public route)
const getAllDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;
    const filter = specialization ? { specialization } : {};

    let doctors = await Doctor.find(filter).populate('user', 'name email');
    // Filter out orphaned profiles where user is deleted/null
    doctors = doctors.filter(doctor => doctor.user !== null);
    
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single doctor by ID (public route)
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');
    if (!doctor || !doctor.user) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current doctor profile
const getMyDoctorProfile = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can access this route' });
    }

    let doctor = await Doctor.findOne({ user: req.user.id }).populate('user', 'name email');
    
    if (!doctor && mongoose.Types.ObjectId.isValid(req.user.id)) {
      doctor = await Doctor.findOne({ 
        user: new mongoose.Types.ObjectId(req.user.id) 
      }).populate('user', 'name email');
    }

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDoctorProfile, getAllDoctors, getDoctorById, getMyDoctorProfile };
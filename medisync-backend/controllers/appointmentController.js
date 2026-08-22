const Appointment = require('../models/Appointment');
const Slot = require('../models/Slot');
const Doctor = require('../models/Doctor');

// Helper: Check if slot date/time is in the past
const isSlotExpired = (date, startTime) => {
    const slotDateTime = new Date(`${date}T${startTime}:00`);
    return slotDateTime < new Date();
};

// Helper: Check if appointment is within 24 hours
const isWithin24Hours = (date, startTime) => {
    const slotDateTime = new Date(`${date}T${startTime}:00`);
    const now = new Date();
    const hoursDifference = (slotDateTime - now) / (1000 * 60 * 60);
    return hoursDifference < 24;
};

// Book an appointment (patient only)
const bookAppointment = async (req, res) => {
    try {
        if (req.user.role !== 'patient') {
            return res.status(403).json({ message: 'Only patients can book appointments' });
        }

        const { slotId } = req.body;

        if (!slotId) {
            return res.status(400).json({ message: 'Slot ID is required' });
        }

        const slot = await Slot.findOneAndUpdate(
            { _id: slotId, isBooked: false },
            { isBooked: true },
            { new: true }
        );

        if (!slot) {
            return res.status(400).json({ 
                message: 'Slot is already booked or does not exist' 
            });
        }

        if (isSlotExpired(slot.date, slot.startTime)) {
            await Slot.findByIdAndUpdate(slotId, { isBooked: false });
            return res.status(400).json({ 
                message: 'Cannot book a slot that has already passed' 
            });
        }

        const doctorProfile = await Doctor.findById(slot.doctor);
        if (!doctorProfile) {
            await Slot.findByIdAndUpdate(slotId, { isBooked: false });
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const appointment = await Appointment.create({
            patient: req.user.id,
            doctor: doctorProfile._id,
            slot: slot._id,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: 'confirmed'
        });

        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('patient', 'name email')
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email' }
            });

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment: populatedAppointment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get appointments (patient sees theirs, doctor sees their patients)
const getMyAppointments = async (req, res) => {
    try {
        let appointments;

        if (req.user.role === 'patient') {
            appointments = await Appointment.find({ patient: req.user.id })
                .populate({
                    path: 'doctor',
                    populate: { path: 'user', select: 'name email' }
                })
                .sort({ date: 1, startTime: 1 });
                
        } else if (req.user.role === 'doctor') {
            const doctorProfile = await Doctor.findOne({ user: req.user.id });
            if (!doctorProfile) {
                return res.status(404).json({ message: 'Doctor profile not found' });
            }
            appointments = await Appointment.find({ doctor: doctorProfile._id })
                .populate('patient', 'name email')
                .sort({ date: 1, startTime: 1 });
        } else {
            return res.status(403).json({ message: 'Invalid role' });
        }

        res.status(200).json({
            count: appointments.length,
            appointments
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel appointment with 24-hour rule
const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const doctorProfile = await Doctor.findOne({ user: req.user.id });
        const isDoctor = doctorProfile && 
            appointment.doctor.toString() === doctorProfile._id.toString();
        const isPatient = appointment.patient.toString() === req.user.id;

        if (!isPatient && !isDoctor) {
            return res.status(403).json({ 
                message: 'You can only cancel your own appointments' 
            });
        }

        if (appointment.status === 'cancelled') {
            return res.status(400).json({ message: 'Appointment is already cancelled' });
        }

        if (appointment.status === 'completed') {
            return res.status(400).json({ message: 'Cannot cancel a completed appointment' });
        }

        if (isSlotExpired(appointment.date, appointment.startTime)) {
            return res.status(400).json({ 
                message: 'Cannot cancel an appointment that has already started or is in the past.' 
            });
        }

        // 24-hour rule applies to patients only
        if (isPatient && isWithin24Hours(appointment.date, appointment.startTime)) {
            return res.status(400).json({ 
                message: 'Cannot cancel appointment within 24 hours of the scheduled time.' 
            });
        }

        appointment.status = 'cancelled';
        appointment.cancelledBy = req.user.id;
        appointment.cancelledAt = new Date();
        await appointment.save();

        await Slot.findByIdAndUpdate(appointment.slot, { isBooked: false });

        res.status(200).json({ 
            message: 'Appointment cancelled successfully',
            appointment 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Doctor marks appointment as completed
const completeAppointment = async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Only doctors can complete appointments' });
        }

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const doctorProfile = await Doctor.findOne({ user: req.user.id });
        if (!doctorProfile || appointment.doctor.toString() !== doctorProfile._id.toString()) {
            return res.status(403).json({ message: 'This is not your appointment' });
        }

        if (appointment.status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot complete a cancelled appointment' });
        }

        if (appointment.status === 'completed') {
            return res.status(400).json({ message: 'Appointment is already completed' });
        }

        appointment.status = 'completed';
        await appointment.save();

        res.status(200).json({ 
            message: 'Appointment marked as completed',
            appointment 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { bookAppointment, getMyAppointments, cancelAppointment, completeAppointment };
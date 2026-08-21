const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const Doctor = require('../models/Doctor');
const registerUser = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            role,
            specialization,
            qualification,
            experienceYears,
            consultationFee,
            bio
        } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Doctor professional information is required
        if (role === "doctor") {

            if (
                !specialization ||
                !qualification ||
                experienceYears === undefined ||
                consultationFee === undefined
            ) {
                return res.status(400).json({
                    message: "All doctor professional details are required"
                });
            }
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // If doctor, create Doctor profile
        if (role === "doctor") {

            await Doctor.create({
                user: user._id,
                specialization,
                qualification,
                experienceYears,
                consultationFee,
                bio
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const loginUser=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const userexists=await User.findOne({email});
        if(!userexists){
         return res.status(400).json({message:'user not found'});
        }
const Match=await bcrypt.compare(password,userexists.password);
if(!Match){
return res.status(400).json({message:"invalid credentials"});
}
const token=jwt.sign({id:userexists._id,role:userexists.role},
    process.env.JWT_SECRET,
    {expiresIn:'7d'}
)

res.status(200).json({
    _id:userexists.id,
    email:userexists.email,
    role:userexists.role,
    token
})
}catch(error){
res.status(500).json({message:error.message})
}
}
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.error('getMe error:', error);   // <-- Add this line
        res.status(500).json({ message: error.message });
    }
};

module.exports={registerUser,loginUser,getMe};
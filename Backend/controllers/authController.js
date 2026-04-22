const User = require('../models/User');
const Issue = require('../models/Issue');
const jwt = require('jsonwebtoken');
const { getUniversityFromEmail } = require('../utils/university');

const generateToken = (id)=>{
    return jwt.sign({ id },process.env.JWT_SECRET,{expiresIn:'30d'});
};

exports.registerUser = async (req,res)=>{
    try{
        const {name, email, password, role}=req.body;
        const university = getUniversityFromEmail(email);
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:'User already exists'});
        }
        const user = await User.create({name, email, university, password, role: role || 'student'});

        res.status(201).json({
            token : generateToken(user._id),
            user : {id: user._id, name: user.name, email: user.email, role: user.role, university: user.university}
        });
    }catch(error){
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User already exists' });
        }
        res.status(500).json({message: error.message});
    }
};

 exports.loginUser = async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user = await User.findOne({email});

        if (user && (await user.matchPassword(password))){
            res.json({
                token: generateToken(user._id),
                user: {id: user._id, name: user.name, email: user.email, role: user.role, university: user.university || getUniversityFromEmail(user.email)}
            });
        }
        else{
            res.status(401).json({message: "Invalid credentials"});
        }
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

exports.getUniversityUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can access users list' });
        }

        const university = req.user.university || getUniversityFromEmail(req.user.email);

        const users = await User.find({ university })
            .select('name email role university createdAt')
            .sort({ createdAt: -1 });

        return res.json(users);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteUniversityUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can delete users' });
        }

        const targetUserId = req.params.id;
        if (!targetUserId) {
            return res.status(400).json({ message: 'User id is required' });
        }

        if (targetUserId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }

        const adminUniversity = req.user.university || getUniversityFromEmail(req.user.email);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const targetUniversity = targetUser.university || getUniversityFromEmail(targetUser.email);
        if (targetUniversity !== adminUniversity) {
            return res.status(403).json({ message: 'You can only delete users in your organisation' });
        }

        if (targetUser.role === 'admin') {
            return res.status(403).json({ message: 'Admin accounts cannot be deleted from this panel' });
        }

        if (targetUser.role === 'student') {
            await Issue.deleteMany({ user: targetUser._id });
        }

        if (targetUser.role === 'maintenance') {
            await Issue.updateMany(
                { assignedTo: targetUser._id, status: 'In-Progress' },
                { $set: { status: 'Pending' } }
            );
            await Issue.updateMany(
                { assignedTo: targetUser._id },
                { $set: { assignedTo: null } }
            );
        }

        await User.findByIdAndDelete(targetUser._id);

        return res.json({
            message: 'User deleted successfully',
            deletedUserId: targetUser._id
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

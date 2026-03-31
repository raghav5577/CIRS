const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id)=>{
    return jwt.sign({ id },process.env.JWT_SECRET,{expiresIn:'30d'});
};

exports.registerUser = async (req,res)=>{
    try{
        const {name, email, universityID, password, role}=req.body;

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:'User already exists'});
        }
        const user = await User.create({name, email, universityID, password, role: role || 'student'});

        res.status(201).json({
            token : generateToken(user._id),
            user : {id: user._id, name: user.name, email: user.email, role: user.role }
        });
    }catch(error){
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
                user: {id: user._id, name: user.name, email: user.email, role: user.role}
            });
        }
        else{
            res.status(401).json({message: "Invalid credentials"});
        }
    }
    catch{
        res.status(500).json({message: error.message});
    }
};

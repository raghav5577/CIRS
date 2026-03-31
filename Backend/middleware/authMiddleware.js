const jwt = require('jsonwebtoken');
const user = require('../models/User');

const protect = async (req, res, next)=>{
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]; //get token from header 
            const decoded = jwt.verify(token, process.env.JWT_SECRET); //verify token
            req.user = await user.findById(decoded.id).select('-password'); //get user from token
            next();
        }
        catch(error){
            console.error(error);
            res.status(401).json({message: 'Not authorized'});
        }
    }
    if(!token){
        res.status(401).json({message : "Not authorized"})
    }
};

module.exports = {protect};

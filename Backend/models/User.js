const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, 
        required: true
    },
    email : {
        type: String,
        required : true,
        unique : true,
    },
    universityID : {
        type : String,
        required : true, 
        unique : true,
    },
    password : {
        type : String,
        required : true,
        unique : true,
    },
    role : {
        type : String,
        enum : ['student', 'maintenance', 'admin'],
        default : 'student',
    }
    
},{timestamps:true});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await require('bcryptjs').genSalt(10);
    this.password = await require('bcryptjs').hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await require('bcryptjs').compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User',userSchema);
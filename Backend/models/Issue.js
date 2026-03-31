const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: [true, 'Please add a title'] 
    },
    description: { 
        type: String, 
        required: [true, 'Please add a description'] 
    },
    category: { 
        type: String, 
        required: true, 
        enum: ['Maintenance', 'IT Support', 'Safety', 'Facilities', 'Academic'] 
    },
    department: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'In-Progress', 'Resolved'], 
        default: 'Pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);

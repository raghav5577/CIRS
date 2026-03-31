const Issue = require('../models/Issue');

exports.createIssue = async (req,res)=>{
    try{
        const {title, description, category} = req.body;

        const departmentMap = {
             'Maintenance': 'Estate Office',
            'IT Support': 'IT Cell',
            'Safety': 'Campus Security',
            'Facilities': 'Admin Block',
            'Academic': 'Dean Office'
        };
        const department = departmentMap[category];

        const issue = await Issue.create({
            user: req.user._id,
            title,
            description,
            category,
            department,
            status: "Pending"
        });
        res.status(201).json(issue);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

exports.getIssues = async (req,res)=>{
    try{
        const issues = await Issue.find({user: req.user._id}).sort({createdAt: -1});
        res.json(issues);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};
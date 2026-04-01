const Issue = require('../models/Issue');
const { getUniversityFromEmail } = require('../utils/university');

exports.createIssue = async (req,res)=>{
    try{
        const {title, description, category, location} = req.body;
        const university = req.user.university || getUniversityFromEmail(req.user.email);

        const departmentMap = {
             'Maintenance': 'Sterling and Wilson',
            'IT Support': 'IT Cell',
            'Safety': 'CPS Security',
            'Facilities': 'Admin Block',
            'Academic': 'Academic Office'
        };
        const department = departmentMap[category];

        const issue = await Issue.create({
            user: req.user._id,
            title,
            description,
            category,
            department,
            location,
            university,
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
        if (req.user.role === 'admin' || req.user.role === 'maintenance') {
            const university = req.user.university || getUniversityFromEmail(req.user.email);

            const issues = await Issue.find({
                $or: [
                    { university },
                    { university: { $exists: false } },
                    { university: null },
                    { university: '' }
                ]
            })
                .populate({ path: 'user', select: 'name email role' })
                .sort({ createdAt: -1 });

            const filteredIssues = issues.filter((issue) => {
                if (issue.university) {
                    return issue.university === university;
                }

                if (!issue.user?.email) {
                    return false;
                }

                return getUniversityFromEmail(issue.user.email) === university;
            });

            return res.json(filteredIssues);
        }

        const issues = await Issue.find({user: req.user._id}).sort({createdAt: -1});
        return res.json(issues);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};
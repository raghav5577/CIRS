const Issue = require('../models/Issue');
const User = require('../models/User');
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

exports.getIssues = async (req, res) => {
  try {
    const university = req.user.university || getUniversityFromEmail(req.user.email);

    if (req.user.role === 'admin') {
      const issues = await Issue.find({
        $or: [
          { university },
          { university: { $exists: false } },
          { university: null },
          { university: '' }
        ]
      })
        .populate({ path: 'user', select: 'name email role' })
        .populate({ path: 'assignedTo', select: 'name email role university' })
        .sort({ createdAt: -1 });

      const filteredIssues = issues.filter((issue) => {
        if (issue.university) return issue.university === university;
        if (!issue.user?.email) return false;
        return getUniversityFromEmail(issue.user.email) === university;
      });

      return res.json(filteredIssues);
    }

    if (req.user.role === 'maintenance') {
      const assignedIssues = await Issue.find({
        assignedTo: req.user._id,
        university
      })
        .populate({ path: 'user', select: 'name email role' })
        .populate({ path: 'assignedTo', select: 'name email role university' })
        .sort({ createdAt: -1 });

      return res.json(assignedIssues);
    }

    const issues = await Issue.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update issue status function 
exports.updateIssueStatus = async (req, res) => {
  try {
    if (req.user.role !== 'maintenance') {
      return res.status(403).json({ message: 'Only maintenance staff can update status' });
    }

    const { status } = req.body;
    const allowedStatuses = ['In-Progress', 'Resolved'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (!issue.assignedTo || issue.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can update only issues assigned to you' });
    }

    issue.status = status;
    await issue.save();

    const updatedIssue = await Issue.findById(issue._id)
      .populate({ path: 'user', select: 'name email role' })
      .populate({ path: 'assignedTo', select: 'name email role university' });

    return res.json(updatedIssue);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.assignWorker = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can assign workers' });
        }

        const { workerId } = req.body;
        if (!workerId) {
            return res.status(400).json({ message: 'workerId is required' });
        }

        const university = req.user.university || getUniversityFromEmail(req.user.email);

        const [issue, worker] = await Promise.all([
            Issue.findById(req.params.id),
            User.findById(workerId)
        ]);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        const issueUniversity = issue.university || (issue.user?.email ? getUniversityFromEmail(issue.user.email) : null);
        if (issueUniversity !== university) {
            return res.status(403).json({ message: 'You can only assign tickets in your organisation' });
        }

        if (!worker || worker.role !== 'maintenance') {
            return res.status(400).json({ message: 'Invalid worker' });
        }

        const workerUniversity = worker.university || getUniversityFromEmail(worker.email);
        if (workerUniversity !== university) {
            return res.status(403).json({ message: 'Worker must belong to your organisation' });
        }

        issue.assignedTo = worker._id;
        if (issue.status === 'Pending') {
            issue.status = 'In-Progress';
        }
        await issue.save();

        const updatedIssue = await Issue.findById(issue._id)
            .populate({ path: 'user', select: 'name email role' })
            .populate({ path: 'assignedTo', select: 'name email role university' });

        return res.json(updatedIssue);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
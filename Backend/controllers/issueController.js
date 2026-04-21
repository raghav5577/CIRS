const Issue = require('../models/Issue');
const User = require('../models/User');
const { getUniversityFromEmail } = require('../utils/university');

const ISSUE_CATEGORIES = ['Maintenance', 'IT Support', 'Safety', 'Facilities', 'Academic'];
const DEPARTMENT_MAP = {
    Maintenance: 'Sterling and Wilson',
    'IT Support': 'IT Cell',
    Safety: 'CPS Security',
    Facilities: 'Admin Block',
    Academic: 'Academic Office'
};

const buildAutofillPrompt = (issueText) => `
You are helping fill a campus issue reporting form.

Allowed categories:
- Maintenance
- IT Support
- Safety
- Facilities
- Academic

Based on the user's report, extract the best possible values for:
- title: short and specific
- description: a clean, helpful issue description
- category: must be exactly one allowed category
- location: short location string, or "" if missing

Return JSON only with this exact shape:
{"title":"","description":"","category":"","location":""}

User report:
${issueText}
`;

const extractJsonObject = (text) => {
    if (!text) {
        return null;
    }

    const trimmed = text.trim();
    try {
        return JSON.parse(trimmed);
    } catch (error) {
        const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return null;
        }

        try {
            return JSON.parse(jsonMatch[0]);
        } catch (nestedError) {
            return null;
        }
    }
};

const sanitizeAutofill = (draft, fallbackText) => {
    const safeDraft = draft && typeof draft === 'object' ? draft : {};
    const normalizedCategory = ISSUE_CATEGORIES.includes(safeDraft.category)
        ? safeDraft.category
        : 'Maintenance';
    const normalizedDescription = typeof safeDraft.description === 'string' && safeDraft.description.trim()
        ? safeDraft.description.trim()
        : fallbackText;
    const normalizedTitle = typeof safeDraft.title === 'string' && safeDraft.title.trim()
        ? safeDraft.title.trim()
        : normalizedDescription.slice(0, 80) || 'Campus issue report';
    const normalizedLocation = typeof safeDraft.location === 'string'
        ? safeDraft.location.trim()
        : '';

    return {
        title: normalizedTitle,
        description: normalizedDescription,
        category: normalizedCategory,
        location: normalizedLocation
    };
};

const requestGroqAutofill = async (issueText) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        const error = new Error('GROQ_API_KEY is not configured');
        error.statusCode = 503;
        throw error;
    }

    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model,
            temperature: 0.2,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: 'You extract structured issue reports and must return valid JSON only.'
                },
                {
                    role: 'user',
                    content: buildAutofillPrompt(issueText)
                }
            ]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(`Groq request failed: ${errorText}`);
        error.statusCode = response.status;
        throw error;
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    const parsed = extractJsonObject(content);

    if (!parsed) {
        throw new Error('Groq returned an unreadable autofill response');
    }

    return sanitizeAutofill(parsed, issueText);
};

exports.createIssue = async (req,res)=>{
    try{
        const {title, description, category, location} = req.body;
        if (!ISSUE_CATEGORIES.includes(category)) {
            return res.status(400).json({ message: 'Invalid issue category' });
        }

        const university = req.user.university || getUniversityFromEmail(req.user.email);
        const department = DEPARTMENT_MAP[category];

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

exports.autofillIssue = async (req, res) => {
    try {
        const issueText = typeof req.body.issueText === 'string' ? req.body.issueText.trim() : '';
        if (!issueText) {
            return res.status(400).json({ message: 'issueText is required' });
        }

        const autofilled = await requestGroqAutofill(issueText);
        return res.json({
            ...autofilled,
            availableCategories: ISSUE_CATEGORIES
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            message: statusCode === 503
                ? 'AI autofill is not configured on the server'
                : 'Failed to generate AI autofill',
            error: error.message
        });
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

import {useState, useEffect} from 'react';
import API from '../api/api';
import './ReportIssueModal.css';

const INITIAL_FORM_DATA = {
    title: '',
    description: '',
    category: 'Maintenance',
    location: '',
    issueImage: ''
};

const ReportIssueModal = ({isOpen, onClose, onIssueCreated})=>{
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [issuePrompt, setIssuePrompt] = useState('');
    const [isAutofilling, setIsAutofilling] = useState(false);
    const [autofillMessage, setAutofillMessage] = useState('');
    const [autofillError, setAutofillError] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if(!isOpen) return null;

    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setIssuePrompt('');
        setAutofillMessage('');
        setAutofillError(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleFieldChange = (field) => (e) => {
        setFormData({...formData, [field]: e.target.value});
        if (autofillMessage) {
            setAutofillMessage('');
            setAutofillError(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, issueImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAutofill = async ()=>{
        const trimmedPrompt = issuePrompt.trim();
        if(!trimmedPrompt){
            setAutofillMessage('Please describe the issue first so AI can fill the form.');
            setAutofillError(true);
            return;
        }

        setIsAutofilling(true);
        setAutofillMessage('');
        setAutofillError(false);
        try{
            const {data} = await API.post('/issues/autofill', { issueText: trimmedPrompt });
            setFormData({
                title: data.title || '',
                description: data.description || trimmedPrompt,
                category: data.category || 'Maintenance',
                location: data.location || '',
            });
            setAutofillMessage('AI filled the form. Review the details and submit when ready.');
        }
        catch(error){
            console.log(error);
            const serverMessage = error.response?.data?.message;
            const message = serverMessage === 'AI autofill is not configured on the server'
                ? 'AI autofill is unavailable right now. If you just added the Groq key, restart the backend server and try again.'
                : (serverMessage || 'AI autofill failed');
            setAutofillMessage(message);
            setAutofillError(true);
        }
        finally{
            setIsAutofilling(false);
        }
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            await API.post('/issues', formData);
            resetForm();
            onIssueCreated();
            onClose();
            alert('Issue reported successfully');
        }
        catch(error){
            console.log(error);
            alert('Failed to report issue');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>🚀 Report New Issue</h2>
                    <button className="close-x" onClick={handleClose}>&times;</button>
                </div>
                
                <p className="modal-sub">Provide details about the campus issue you've encountered.</p>
                
                <form onSubmit={handleSubmit} className="report-form">
                    <label>Describe the Issue Once</label>
                    <textarea
                        rows="4"
                        placeholder="Example: The projector in Block C room 204 is flickering and classes cannot see the slides properly."
                        value={issuePrompt}
                        onChange={(e) => setIssuePrompt(e.target.value)}
                    />
                    <button
                        type="button"
                        className="ai-fill-btn"
                        onClick={handleAutofill}
                        disabled={isAutofilling}
                    >
                        {isAutofilling ? 'Filling with AI...' : 'Autofill with AI'}
                    </button>
                    <p className="ai-hint">AI will choose the closest matching category and draft the rest for you. You can still edit everything before submitting.</p>
                    {autofillMessage ? (
                        <p className={autofillError ? 'ai-status error' : 'ai-status success'}>
                            {autofillMessage}
                        </p>
                    ) : null}
                    <label>Issue Title</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Broken Wi-Fi in Lab BLA-2XX" 
                        value={formData.title} 
                        onChange={handleFieldChange('title')} 
                        required 
                    />
                    <label>Category</label>
                    <select 
                        value={formData.category} 
                        onChange={handleFieldChange('category')}
                    >
                        <option>Maintenance</option>
                        <option>IT Support</option>
                        <option>Safety</option>
                        <option>Facilities</option>
                        <option>Academic</option>
                    </select>
                    <label>Place of Issue</label>
                    <input 
                        type="text" 
                        placeholder="e.g., Library, Block A" 
                        value={formData.location} 
                        onChange={handleFieldChange('location')} 
                        required 
                    />
                    <label>Description</label>
                    <textarea 
                        rows="4" 
                        placeholder="Please describe the issue in detail..." 
                        value={formData.description} 
                        onChange={handleFieldChange('description')} 
                        required 
                    />
                    <label>Upload Image (optional)</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                    />
                    {formData.issueImage && (
                        <div className="image-preview">
                            <img src={formData.issueImage} alt="Issue preview" style={{maxHeight:'150px', borderRadius:'8px', marginTop:'10px'}} />
                        </div>
                    )}
                    <div className="modal-actions">
                        <button type="button" onClick={handleClose} className="cancel-btn">Discard</button>
                        <button type="submit" className="submit-btn highlight">Submit Report</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ReportIssueModal;

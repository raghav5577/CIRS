import {useState} from 'react';
import API from '../api/api';
import './ReportIssueModal.css';

const ReportIssueModal = ({isOpen, onClose, onIssueCreated})=>{
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Maintenance',
        location: '',
});
if(!isOpen) return null;
const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
        await API.post('/issues', formData);
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
                    <button className="close-x" onClick={onClose}>&times;</button>
                </div>
                
                <p className="modal-sub">Provide details about the campus issue you've encountered.</p>
                
                <form onSubmit={handleSubmit} className="report-form">
                    <label>Issue Title</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Broken Wi-Fi in Lab BLA-2XX" 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})} 
                        required 
                    />
                    <label>Category</label>
                    <select 
                        value={formData.category} 
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, location: e.target.value})} 
                        required 
                    />
                    <label>Description</label>
                    <textarea 
                        rows="4" 
                        placeholder="Please describe the issue in detail..." 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        required 
                    />
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">Discard</button>
                        <button type="submit" className="submit-btn highlight">Submit Report</button>
                    </div>
                </form>
            </div>
        </div>
);
};
export default ReportIssueModal;
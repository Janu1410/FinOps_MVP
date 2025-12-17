import { BarChart3, Lightbulb, ShoppingBag, Folder, Users, FileText, Plus, Upload as UploadIcon } from 'lucide-react';
import './Components.css';

const VerticalSidebar = () => {
  return (
    <div className="vertical-sidebar">
      <div className="sidebar-nav">
        <div className="nav-item active">
          <div className="nav-icon">
            <BarChart3 size={20} />
          </div>
          <span>Overview</span>
        </div>
        
        <div className="nav-item">
          <div className="nav-icon">
            <Lightbulb size={20} />
          </div>
          <span>Insights</span>
        </div>
        
        <div className="nav-item">
          <div className="nav-icon">
            <ShoppingBag size={20} />
          </div>
          <span>Sales</span>
          <span className="badge">119</span>
        </div>
        
        <div className="nav-item">
          <div className="nav-icon">
            <Folder size={20} />
          </div>
          <span>Portfolio</span>
        </div>
        
        <div className="nav-submenu">
          <div className="nav-item">Published</div>
          <div className="nav-item">
            Draft
            <span className="badge pink">8</span>
          </div>
          <div className="nav-item">
            Under Review
            <span className="badge dark">5</span>
          </div>
          <div className="nav-item">Earnings</div>
          <div className="nav-item">Pending Reviews</div>
        </div>
        
        <div className="nav-item">
          <div className="nav-icon">
            <Users size={20} />
          </div>
          <span>Referrals</span>
        </div>
        
        <div className="nav-item">
          <div className="nav-icon">
            <FileText size={20} />
          </div>
          <span>Reports</span>
        </div>
      </div>
      
      <button className="submit-request-btn">
        <Plus size={18} />
        <span>Submit Request</span>
      </button>
      
      <div className="upload-area">
        <div className="upload-icon">
          <UploadIcon size={32} />
        </div>
        <p>Upload new product</p>
        <p className="upload-hint">Drag and drop here</p>
      </div>
    </div>
  );
};

export default VerticalSidebar;

import { Search, Bell, Download, Globe, ChevronDown, User } from 'lucide-react';
import './Components.css';

const Header = () => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
      </div>
      
      <div className="header-center">
        <h1 className="page-title">Administration Overview</h1>
        <div className="search-bar">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      
      <div className="header-right">
        <div className="header-icon">
          <Bell size={18} />
        </div>
        <div className="header-icon">
          <Download size={18} />
        </div>
        <div className="language-selector">
          <Globe size={16} />
          <span>USA</span>
          <ChevronDown size={14} />
        </div>
        <div className="user-profile">
          <div className="profile-avatar">
            <User size={16} />
          </div>
          <ChevronDown size={14} />
        </div>
      </div>
    </header>
  );
};

export default Header;

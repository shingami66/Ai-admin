import React, { useState, useEffect } from 'react';
import { User, Image, Video, Bell, UserCircle, ChevronDown, Users, Edit, Trash2, Eye, UserPlus, Bolt, DollarSign, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../admin.css';
import { useAdminData } from '../hooks/useAdminData';
import { useAdminContext } from '../context/AdminContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin, adminLogout } = useAdminContext();
  
  // Use custom hook for data management
  const {
    stats,
    users: userData,
    content: contentData,
    subscriptions,
    payments,
    complaints,
    loading,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
    handleDeleteContent,
    handleUpdateSubscription,
    handleDeleteSubscription,
    handleDeleteComplaint
  } = useAdminData();
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [contentFilter, setContentFilter] = useState('All Types');
  const [subscriptionFilter, setSubscriptionFilter] = useState('All Status');
  const [paymentFilter, setPaymentFilter] = useState('All Status');
  
  const [editingSubscription, setEditingSubscription] = useState<any>(null);
  const [newSubscriptionStatus, setNewSubscriptionStatus] = useState('');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '' });
  
  // Add new state for content viewing
  const [viewingContent, setViewingContent] = useState<any>(null);
  
  // Function to open content viewer
  const openContentViewer = (content: any) => {
    setViewingContent(content);
  };

  // Add new state for profile
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Use admin data from context
  useEffect(() => {
    if (!admin) {
      navigate('/');
    }
  }, [admin, navigate]);

  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };

  const openModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'status-badge status-active';
      case 'inactive': return 'status-badge status-inactive';
      case 'pending': return 'status-badge status-pending';
      case 'expired': return 'status-badge status-inactive';
      case 'canceled': return 'status-badge status-inactive';
      case 'completed': return 'status-badge status-active';
      case 'failed': return 'status-badge status-inactive';
      default: return 'status-badge status-active';
    }
  };

  const handleEditSubscription = (subscription: any) => {
    setEditingSubscription(subscription);
    setNewSubscriptionStatus(subscription.status);
  };

  const handleUpdateSubscriptionClick = async () => {
    if (editingSubscription && newSubscriptionStatus) {
      const result = await handleUpdateSubscription(editingSubscription.id, newSubscriptionStatus);
      if (result.success) {
        alert('Subscription updated successfully!');
        setEditingSubscription(null);
        setNewSubscriptionStatus('');
      }
    }
  };

  const handleDeleteSubscriptionClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      const result = await handleDeleteSubscription(id);
      if (result.success) {
        alert('Subscription deleted successfully!');
      }
    }
  };

  const handleDeleteUserClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await handleDeleteUser(id);
      if (result.success) {
        alert('User deleted successfully!');
      }
    }
  };

  const handleDeleteContentClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      const result = await handleDeleteContent(id);
      if (result.success) {
        alert('Content deleted successfully!');
      }
    }
  };

  const handleDeleteComplaintClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      const result = await handleDeleteComplaint(id);
      if (result.success) {
        alert('Complaint deleted successfully!');
      }
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (subscriptionFilter !== 'All Status' && sub.status !== subscriptionFilter) {
      return false;
    }
    return true;
  });

  const filteredPayments = payments.filter(payment => {
    if (paymentFilter !== 'All Status' && payment.status !== paymentFilter) {
      return false;
    }
    return true;
  });

  // Add profile render function
  const renderAdminHeader = () => (
    <div className="admin-header">
      <h1>Admin Dashboard</h1>
      <div className="admin-profile">
        <div className="user-menu" onClick={() => setShowDropdown(!showDropdown)}>
          <span className="user-icon">👤</span>
          <span className="user-name">{admin?.username || 'Admin'}</span>
          <span className="dropdown-arrow">▼</span>
          {showDropdown && (
            <div className="dropdown">
              <button onClick={() => openModal('profile')}>Profile</button>
              <button onClick={handleLogout}>Log out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h2>Profile Settings</h2>
          <button 
            className="close-btn"
            onClick={() => setActiveModal(null)}
          >
            ✕
          </button>
        </div>
        <div className="profile-content">
          <div className="profile-avatar">
            <h3>{admin?.username}</h3>
            <span className="role-badge">{admin?.role || 'Administrator'}</span>
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={admin?.username || ''}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={admin?.email || ''}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input
              type="text"
              value={admin?.role || 'Administrator'}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {activeModal === 'profile' ? (
        renderProfile()
      ) : (
        <>
          {renderAdminHeader()}
          <div className="main-content-wrapper">
            <div className="dashboard-header">
              <h1 className="dashboard-title">
                AICreate Studio Admin Dashboard
              </h1>
              <p className="dashboard-subtitle">
                Comprehensive management for users, content, subscriptions, and payments. Control all aspects of your system from one centralized location.
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <Users size={48} className="stat-card-icon" />
                <div className="stat-card-value">
                  {stats.totalUsers.toLocaleString()}
                </div>
                <div className="stat-card-label">Total Users</div>
              </div>

              <div className="stat-card">
                <Image size={48} className="stat-card-icon" />
                <div className="stat-card-value">
                  {stats.imagesGenerated.toLocaleString()}
                </div>
                <div className="stat-card-label">Images Generated</div>
              </div>

              <div className="stat-card">
                <Video size={48} className="stat-card-icon" />
                <div className="stat-card-value">
                  {stats.videosCreated.toLocaleString()}
                </div>
                <div className="stat-card-label">Videos Created</div>
              </div>

              <div className="stat-card">
                <DollarSign size={48} className="stat-card-icon" />
                <div className="stat-card-value">
                  ${stats.totalRevenue.toLocaleString()}
                </div>
                <div className="stat-card-label">Total Revenue</div>
              </div>
            </div>

            <div className="main-content">
              <div className="management-card">
                <h2 className="management-header">
                  <Users />
                  User Management
                </h2>
                
                <div className="filter-controls">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Banned</option>
                  </select>
                </div>

                <div className="table-container">
                  <table className="management-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Join Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={getStatusBadgeClass(user.status)}>
                              {user.status}
                            </span>
                          </td>
                          <td>{user.joinDate}</td>
                          <td>
                            <button 
                              className="action-button edit-button"
                              onClick={() => alert('Edit user feature coming soon!')}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="action-button delete-button"
                              onClick={() => handleDeleteUserClick(user.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="management-card">
                <h2 className="management-header">
                  <Image />
                  Content Management
                </h2>
                
                <div className="filter-controls">
                  <input
                    type="text"
                    placeholder="Search content..."
                    className="search-input"
                  />
                  <select
                    value={contentFilter}
                    onChange={(e) => setContentFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option>All Types</option>
                    <option>Images</option>
                    <option>Videos</option>
                    <option>Text</option>
                  </select>
                </div>

                <div className="table-container">
                  <table className="management-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Creator</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contentData.map((content) => (
                        <tr key={content.id}>
                          <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
                            {content.title}
                          </td>
                          <td>
                            <span className={`badge badge-${content.type}`}>
                              {content.type === 'image' ? '🖼️ Image' : 
                               content.type === 'video' ? '🎬 Video' : 
                               content.type === 'text' ? '📝 Text' : content.type}
                            </span>
                          </td>
                          <td>{content.creator}</td>
                          <td>{content.date}</td>
                          <td>
                            {/* عرض معاينة حسب نوع المحتوى */}
                            {content.type === 'image' && content.imageUrl && (
                              <div style={{ textAlign: 'center' }}>
                                <img 
                                  src={content.imageUrl} 
                                  alt={content.title}
                                  style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    border: '2px solid transparent'
                                  }}
                                  onClick={() => openContentViewer(content)}
                                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.border = '2px solid #667eea'}
                                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.border = '2px solid transparent'}
                                />
                              </div>
                            )}
                            
                            {content.type === 'video' && content.videoUrl && (
                              <div style={{ textAlign: 'center' }}>
                                <div 
                                  style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: '#ff6b6b',
                                    borderRadius: '50%',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => openContentViewer(content)}
                                >
                                  🎬
                                </div>
                              </div>
                            )}
                            
                            {content.type === 'text' && (
                              <div style={{ textAlign: 'center' }}>
                                <div 
                                  style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: '#4ecdc4',
                                    borderRadius: '50%',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => openContentViewer(content)}
                                >
                                  📝
                                </div>
                              </div>
                            )}
                          </td>
                          <td>
                            <button 
                              className="action-button edit-button"
                              onClick={() => openContentViewer(content)}
                              title="View Content"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className="action-button delete-button"
                              onClick={() => handleDeleteContentClick(content.id)}
                              title="Delete Content"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="management-card" style={{ marginTop: '2rem' }}>
              <h2 className="management-header">
                <Bolt />
                Subscription Management
              </h2>
              
              <div className="filter-controls">
                <input
                  type="text"
                  placeholder="Search subscriptions..."
                  className="search-input"
                />
                <select
                  value={subscriptionFilter}
                  onChange={(e) => setSubscriptionFilter(e.target.value)}
                  className="filter-select"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Expired</option>
                  <option>Canceled</option>
                </select>
              </div>

              <div className="table-container">
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.map((subscription) => (
                      <tr key={subscription.id}>
                        <td>{subscription.user}</td>
                        <td>{subscription.plan}</td>
                        <td>
                          <span className={getStatusBadgeClass(subscription.status)}>
                            {subscription.status}
                          </span>
                        </td>
                        <td>{subscription.startDate}</td>
                        <td>{subscription.endDate}</td>
                        <td>
                          <button 
                            className="action-button edit-button"
                            onClick={() => handleEditSubscription(subscription)}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="action-button delete-button"
                            onClick={() => handleDeleteSubscriptionClick(subscription.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="management-card" style={{ marginTop: '2rem' }}>
              <h2 className="management-header">
                <DollarSign />
                Payment Logs
              </h2>
              
              <div className="filter-controls">
                <input
                  type="text"
                  placeholder="Search payments..."
                  className="search-input"
                />
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="filter-select"
                >
                  <option>All Status</option>
                  <option>Completed</option>
                  <option>Failed</option>
                  <option>Pending</option>
                </select>
              </div>

              <div className="table-container">
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.user}</td>
                        <td>{payment.amount}</td>
                        <td>{payment.method}</td>
                        <td>
                          <span className={getStatusBadgeClass(payment.status)}>
                            {payment.status}
                          </span>
                        </td>
                        <td>{payment.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="management-card" style={{ marginTop: '2rem' }}>
              <h2 className="management-header">
                <MessageSquare />
                Complaints & Suggestions
              </h2>
              
              <div className="filter-controls">
                <input
                  type="text"
                  placeholder="Search complaints..."
                  className="search-input"
                />
              </div>

              <div className="table-container">
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((complaint) => (
                      <tr key={complaint.id}>
                        <td>{complaint.user}</td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {complaint.description}
                        </td>
                        <td>
                          <span className={getStatusBadgeClass(complaint.status)}>
                            {complaint.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="action-button delete-button"
                            onClick={() => handleDeleteComplaintClick(complaint.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="quick-actions-grid">
              <div 
                onClick={() => openModal('userModal')}
                className="quick-action-card"
              >
                <UserPlus size={48} style={{ marginBottom: '1rem', opacity: 0.8 }} />
                <h3>Add New User</h3>
                <p>Create a new user account with specific permissions</p>
              </div>
            </div>
          </div>

          {activeModal === 'userModal' && (
            <div 
              className="modal-overlay"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeModal();
                }
              }}
            >
              <div className="modal-content">
                <span 
                  onClick={closeModal}
                  className="modal-close-button"
                >
                  ×
                </span>
                <h2 className="modal-title">Add New User</h2>
                <div>
                  <div className="modal-form-group">
                    <label className="modal-label">User Name</label>
                    <input 
                      type="text"
                      placeholder="Enter User Name"
                      className="modal-input"
                      value={newUserData.name}
                      onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label className="modal-label">Email</label>
                    <input 
                      type="email"
                      placeholder="Enter Email"
                      className="modal-input"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label className="modal-label">Password</label>
                    <input 
                      type="password"
                      placeholder="Enter Password"
                      className="modal-input"
                      value={newUserData.password}
                      onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                    />
                  </div>
                  <button 
                    className="modal-submit-button"
                    onClick={async () => {
                      if (newUserData.name && newUserData.email && newUserData.password) {
                        const result = await handleAddUser(newUserData.name, newUserData.email, newUserData.password);
                        if (result.success) {
                          alert('User added successfully!');
                          setNewUserData({ name: '', email: '', password: '' });
                          closeModal();
                        } else {
                          alert('Failed to add user. Please try again.');
                        }
                      } else {
                        alert('Please fill all fields!');
                      }
                    }}
                  >
                    Add User
                  </button>
                </div>
              </div>
            </div>
          )}

          {editingSubscription && (
            <div 
              className="modal-overlay"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setEditingSubscription(null);
                }
              }}
            >
              <div className="modal-content">
                <span 
                  onClick={() => setEditingSubscription(null)}
                  className="modal-close-button"
                >
                  ×
                </span>
                <h2 className="modal-title">Edit Subscription Status</h2>
                <div>
                  <div className="modal-form-group">
                    <label className="modal-label">User</label>
                    <input 
                      type="text"
                      value={editingSubscription.user}
                      disabled
                      className="modal-input"
                      style={{ opacity: 0.7 }}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label className="modal-label">Plan</label>
                    <input 
                      type="text"
                      value={editingSubscription.plan}
                      disabled
                      className="modal-input"
                      style={{ opacity: 0.7 }}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label className="modal-label">Subscription Status</label>
                    <select 
                      value={newSubscriptionStatus}
                      onChange={(e) => setNewSubscriptionStatus(e.target.value)}
                      className="modal-select"
                    >
                      <option value="Active">Active</option>
                      <option value="Expired">Expired</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </div>
                  <button 
                    className="modal-submit-button"
                    onClick={handleUpdateSubscriptionClick}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content Viewer Modal */}
          {viewingContent && (
            <div 
              className="modal-overlay" 
              onClick={() => setViewingContent(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.8)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div 
                className="modal-content" 
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setViewingContent(null)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ×
                </button>
                
                <h3 style={{ marginBottom: '1rem', color: '#333' }}>
                  {viewingContent.title}
                </h3>
                
                <div style={{ marginBottom: '1rem', color: '#666', fontSize: '14px' }}>
                  <strong>Creator:</strong> {viewingContent.creator} | 
                  <strong> Date:</strong> {viewingContent.date} |
                  <strong> Type:</strong> {viewingContent.type}
                </div>
                
                {/* Display image */}
                {viewingContent.type === 'image' && viewingContent.imageUrl && (
                  <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                    <img 
                      src={viewingContent.imageUrl} 
                      alt={viewingContent.title}
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '600px', 
                        objectFit: 'contain',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                  </div>
                )}
                
                {/* Display video */}
                {viewingContent.type === 'video' && viewingContent.videoUrl && (
                  <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                    <video 
                      src={viewingContent.videoUrl}
                      controls
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '600px',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                      onError={(e) => {
                        console.error('Video error:', e);
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                
                {/* Display text */}
                {viewingContent.type === 'text' && viewingContent.textContent && (
                  <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '1rem', 
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    border: '1px solid #eee',
                    maxHeight: '400px',
                    overflow: 'auto'
                  }}>
                    {viewingContent.textContent}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
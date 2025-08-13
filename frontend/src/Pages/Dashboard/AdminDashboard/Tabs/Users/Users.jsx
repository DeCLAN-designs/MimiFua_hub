import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaUser, FaUserTie, FaTimes, FaSave } from 'react-icons/fa';
import adminService from '../../../../../services/adminService';
import { toast } from 'react-toastify';
import './Users.css';

const Users = ({ users: propUsers, onStatusChange }) => {
  const [users, setUsers] = useState(propUsers || []);
  const [loading, setLoading] = useState(!propUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'delete'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'employee',
    status: 'active'
  });

  // Update users when props change
  useEffect(() => {
    if (propUsers) {
      setUsers(propUsers);
      setLoading(false);
    }
  }, [propUsers]);

  // Fetch users if not provided via props
  useEffect(() => {
    if (!propUsers) {
      fetchUsers();
    }
  }, [propUsers]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await adminService.users.get();
      setUsers(userData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      if (onStatusChange) {
        await onStatusChange(userId, newStatus);
      } else {
        await adminService.users.updateStatus(userId, newStatus);
        await fetchUsers(); // Refresh data
        toast.success('User status updated successfully');
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error('Failed to update user status');
    }
  };

  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    if (mode === 'edit' && user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '', // Don't pre-fill password for security
        role: user.role || 'employee',
        status: user.status || 'active'
      });
    } else if (mode === 'create') {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        role: 'employee',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      role: 'employee',
      status: 'active'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (modalMode === 'create') {
        await adminService.users.create(formData);
        toast.success(`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} created successfully`);
      } else if (modalMode === 'edit') {
        await adminService.users.update(selectedUser.id, formData);
        toast.success(`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} updated successfully`);
      }
      await fetchUsers();
      closeModal();
    } catch (err) {
      console.error('Error saving user:', err);
      toast.error(`Failed to ${modalMode} ${formData.role}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      setLoading(true);
      await adminService.users.delete(selectedUser.id);
      toast.success(`${selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)} deleted successfully`);
      await fetchUsers();
      closeModal();
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(`Failed to delete ${selectedUser.role}`);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'managers' && user.role === 'manager') ||
      (activeTab === 'employees' && user.role === 'employee');
    
    return matchesSearch && matchesTab;
  });

  const managers = users.filter(user => user.role === 'manager');
  const employees = users.filter(user => user.role === 'employee');

  if (loading) {
    return (
      <div className="users-loading">
        <FaSpinner className="spinner" />
        <span>Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-error">
        <h3>Error Loading Users</h3>
        <p>{error}</p>
        <button onClick={fetchUsers} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="admin-card">
        <div className="card-header">
          <h3>User Management</h3>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => openModal('create')}
            >
              <FaPlus /> Add User
            </button>
          </div>
        </div>

        <div className="user-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <FaUser /> All Users ({users.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'managers' ? 'active' : ''}`}
            onClick={() => setActiveTab('managers')}
          >
            <FaUserTie /> Managers ({managers.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            <FaUser /> Employees ({employees.length})
          </button>
        </div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="no-users">
            <p>No users found matching your search criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                  const createdDate = new Date(user.created_at).toLocaleDateString();
                  
                  return (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td className="user-name">
                        <div className="name-cell">
                          <strong>{fullName || 'N/A'}</strong>
                        </div>
                      </td>
                      <td className="user-email">{user.email || 'N/A'}</td>
                      <td className="user-phone">{user.phone || 'N/A'}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <select 
                          value={user.status || 'active'}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          className={`status-select ${user.status || 'active'}`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>
                      <td className="created-date">{createdDate}</td>
                      <td className="actions">
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => openModal('edit', user)}
                            title={`Edit ${user.role}`}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => openModal('delete', user)}
                            title={`Delete ${user.role}`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Create/Edit/Delete */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h4>
                {modalMode === 'create' && 'Add New User'}
                {modalMode === 'edit' && `Edit ${selectedUser?.role || 'User'}`}
                {modalMode === 'delete' && `Delete ${selectedUser?.role || 'User'}`}
              </h4>
              <button className="close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              {modalMode === 'delete' ? (
                <div className="delete-confirmation">
                  <p>Are you sure you want to delete this {selectedUser?.role}?</p>
                  <div className="user-info">
                    <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>
                    <br />
                    <span>{selectedUser?.email}</span>
                  </div>
                  <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      {loading ? <FaSpinner className="spinner" /> : <FaTrash />}
                      Delete {selectedUser?.role || 'User'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+254..."
                    />
                  </div>
                  
                  {modalMode === 'create' && (
                    <div className="form-group">
                      <label>Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength="6"
                        placeholder="Minimum 6 characters"
                      />
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? <FaSpinner className="spinner" /> : <FaSave />}
                      {modalMode === 'create' ? 'Create' : 'Update'} User
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

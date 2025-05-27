import React, { useState } from 'react';
import { Users, Search, Shield, Ban, Eye, RefreshCw } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'garage_owner';
  status: 'active' | 'banned';
  created_at: string;
  last_login: string;
}

// Mock data for users
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin_user',
    email: 'admin@garajimburada.com',
    role: 'admin',
    status: 'active',
    created_at: '2025-01-01T10:00:00',
    last_login: '2025-05-10T14:30:00'
  },
  {
    id: '2',
    username: 'ahmet_yilmaz',
    email: 'ahmet@example.com',
    role: 'user',
    status: 'active',
    created_at: '2025-02-15T09:30:00',
    last_login: '2025-05-09T11:45:00'
  },
  {
    id: '3',
    username: 'mehmet_garage',
    email: 'mehmet@citygarage.com',
    role: 'garage_owner',
    status: 'active',
    created_at: '2025-03-10T15:20:00',
    last_login: '2025-05-08T09:15:00'
  },
  {
    id: '4',
    username: 'banned_user',
    email: 'banned@example.com',
    role: 'user',
    status: 'banned',
    created_at: '2025-04-05T11:10:00',
    last_login: '2025-04-20T16:30:00'
  }
];

const UserManagementTab: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleChangeModal, setRoleChangeModal] = useState(false);
  const [newRole, setNewRole] = useState<'admin' | 'user' | 'garage_owner'>('user');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    if (!searchQuery) {
      return true;
    }
    
    const query = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  });

  const handleToggleUserStatus = async (id: string) => {
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      const updatedUsers = users.map(user => 
        user.id === id 
          ? { ...user, status: user.status === 'active' ? 'banned' as const : 'active' as const } 
          : user
      );
      
      setUsers(updatedUsers);
      const user = updatedUsers.find(u => u.id === id);
      showToast(`User ${user?.status === 'active' ? 'activated' : 'banned'} successfully`, 'success');
      setLoading(false);
    }, 500);
  };

  const openRoleChangeModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleChangeModal(true);
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    setRoleChangeModal(false);
    
    // Simulating API call
    setTimeout(() => {
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, role: newRole } 
          : user
      );
      
      setUsers(updatedUsers);
      showToast(`User role updated to ${newRole.replace('_', ' ')}`, 'success');
      setLoading(false);
    }, 500);
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  // Mock user activity data
  const userActivity = {
    comments: [
      { id: '1', content: 'Great service!', garage_name: 'AutoFix Garage', date: '2025-05-01T10:15:00' },
      { id: '2', content: 'Excellent work on my car!', garage_name: 'City Motors', date: '2025-04-22T14:30:00' }
    ],
    favorites: [
      { id: '1', garage_name: 'AutoFix Garage', date: '2025-05-02T09:45:00' },
      { id: '2', garage_name: 'Turbo Performance', date: '2025-04-15T16:20:00' }
    ],
    garages: [
      { id: '1', name: 'My Auto Shop', status: 'active', created_at: '2025-03-15T11:30:00' }
    ]
  };

  return (
    <div className="card">
      <div className="p-4 border-b border-secondary-200">
        <h2 className="text-lg font-semibold">User Management</h2>
      </div>
      
      <div className="p-4">
        <div className="relative mb-4 w-full md:w-64">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={handleSearch}
            className="input pl-10 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 bg-secondary-50 rounded-lg">
                <p className="text-secondary-500">No users found matching your search.</p>
              </div>
            ) : (
              <>
                {/* Mobile View */}
                <div className="block lg:hidden">
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div 
                        key={user.id} 
                        className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                      >
                        {/* Header Section */}
                        <div className="p-4 border-b border-secondary-100 bg-secondary-50/50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-secondary-900">{user.username}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin' 
                                  ? 'bg-primary-100 text-primary-800' 
                                  : user.role === 'garage_owner'
                                    ? 'bg-accent-100 text-accent-800'
                                    : 'bg-secondary-100 text-secondary-800'
                              }`}>
                                {user.role === 'garage_owner' ? 'Garage Owner' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-white text-primary-600 hover:text-primary-700 transition-colors duration-200"
                                title="View User Details"
                                onClick={() => viewUserDetails(user)}
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-white text-primary-600 hover:text-primary-700 transition-colors duration-200"
                                title="Change Role"
                                onClick={() => openRoleChangeModal(user)}
                              >
                                <Shield size={16} />
                              </button>
                              <button
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-white ${
                                  user.status === 'active' 
                                    ? 'text-error-600 hover:text-error-800' 
                                    : 'text-success-600 hover:text-success-800'
                                }`}
                                title={user.status === 'active' ? 'Ban User' : 'Activate User'}
                                onClick={() => handleToggleUserStatus(user.id)}
                              >
                                {user.status === 'active' ? <Ban size={16} /> : <RefreshCw size={16} />}
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1 text-sm text-secondary-600">
                            <div className="flex items-center gap-2">
                              <span>Email:</span>
                              <span className="font-medium text-secondary-800">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>Status:</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                user.status === 'active' 
                                  ? 'bg-success-100 text-success-800' 
                                  : 'bg-error-100 text-error-800'
                              }`}>
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-4 bg-white">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-secondary-500">Created At</span>
                              <p className="font-medium text-secondary-800">{formatDate(user.created_at)}</p>
                            </div>
                            <div>
                              <span className="text-secondary-500">Last Login</span>
                              <p className="font-medium text-secondary-800">{formatDate(user.last_login)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-secondary-50">
                        <th className="px-4 py-2 text-left font-medium text-secondary-700">Username</th>
                        <th className="px-4 py-2 text-left font-medium text-secondary-700">Email</th>
                        <th className="px-4 py-2 text-left font-medium text-secondary-700">Role</th>
                        <th className="px-4 py-2 text-left font-medium text-secondary-700">Status</th>
                        <th className="px-4 py-2 text-left font-medium text-secondary-700">Last Login</th>
                        <th className="px-4 py-2 text-left font-medium text-secondary-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                          <td className="px-4 py-3 font-medium">{user.username}</td>
                          <td className="px-4 py-3 text-secondary-700">{user.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-primary-100 text-primary-800' 
                                : user.role === 'garage_owner'
                                  ? 'bg-accent-100 text-accent-800'
                                  : 'bg-secondary-100 text-secondary-800'
                            }`}>
                              {user.role === 'garage_owner' ? 'Garage Owner' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' 
                                ? 'bg-success-100 text-success-800' 
                                : 'bg-error-100 text-error-800'
                            }`}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-secondary-700">{formatDate(user.last_login)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                className="text-primary-600 hover:text-primary-800"
                                title="View User Details"
                                onClick={() => viewUserDetails(user)}
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="text-primary-600 hover:text-primary-800"
                                title="Change Role"
                                onClick={() => openRoleChangeModal(user)}
                              >
                                <Shield size={16} />
                              </button>
                              <button
                                className={`${user.status === 'active' ? 'text-error-600 hover:text-error-800' : 'text-success-600 hover:text-success-800'}`}
                                title={user.status === 'active' ? 'Ban User' : 'Activate User'}
                                onClick={() => handleToggleUserStatus(user.id)}
                              >
                                {user.status === 'active' ? <Ban size={16} /> : <RefreshCw size={16} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Role Change Modal */}
      {roleChangeModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold">Change User Role</h3>
            </div>
            <div className="p-4">
              <p className="mb-4 text-secondary-700">
                Change role for user: <span className="font-medium">{selectedUser.username}</span>
              </p>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Select Role
                </label>
                <select
                  className="input w-full"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'admin' | 'user' | 'garage_owner')}
                >
                  <option value="user">User</option>
                  <option value="garage_owner">Garage Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-secondary-200 flex justify-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setRoleChangeModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleRoleChange}
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-auto">
            <div className="p-4 border-b border-secondary-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">User Details</h3>
              <button
                className="text-secondary-500 hover:text-secondary-700"
                onClick={() => setShowUserDetails(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-secondary-500 mb-1">Username</h4>
                  <p className="font-medium">{selectedUser.username}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-secondary-500 mb-1">Email</h4>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-secondary-500 mb-1">Role</h4>
                  <p className="capitalize">{selectedUser.role.replace('_', ' ')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-secondary-500 mb-1">Status</h4>
                  <p className="capitalize">{selectedUser.status}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-secondary-500 mb-1">Created At</h4>
                  <p>{formatDate(selectedUser.created_at)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-secondary-500 mb-1">Last Login</h4>
                  <p>{formatDate(selectedUser.last_login)}</p>
                </div>
              </div>
              
              <div className="border-t border-secondary-200 pt-4 mt-4">
                <h4 className="font-medium mb-4">User Activity</h4>
                
                <div className="space-y-6">
                  {/* Comments */}
                  <div>
                    <h5 className="text-sm font-medium text-secondary-700 mb-2">Comments</h5>
                    {userActivity.comments.length > 0 ? (
                      <div className="space-y-2">
                        {userActivity.comments.map(comment => (
                          <div key={comment.id} className="border border-secondary-200 rounded p-3">
                            <p className="text-sm">{comment.content}</p>
                            <div className="flex justify-between mt-2 text-xs text-secondary-500">
                              <span>On: {comment.garage_name}</span>
                              <span>{formatDate(comment.date)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-secondary-500 text-sm">No comments found.</p>
                    )}
                  </div>
                  
                  {/* Favorites */}
                  <div>
                    <h5 className="text-sm font-medium text-secondary-700 mb-2">Favorited Garages</h5>
                    {userActivity.favorites.length > 0 ? (
                      <div className="space-y-2">
                        {userActivity.favorites.map(favorite => (
                          <div key={favorite.id} className="flex justify-between items-center p-2 border-b border-secondary-100">
                            <span>{favorite.garage_name}</span>
                            <span className="text-xs text-secondary-500">{formatDate(favorite.date)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-secondary-500 text-sm">No favorites found.</p>
                    )}
                  </div>
                  
                  {/* Garages */}
                  {selectedUser.role === 'garage_owner' && (
                    <div>
                      <h5 className="text-sm font-medium text-secondary-700 mb-2">Owned Garages</h5>
                      {userActivity.garages.length > 0 ? (
                        <div className="space-y-2">
                          {userActivity.garages.map(garage => (
                            <div key={garage.id} className="border border-secondary-200 rounded p-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{garage.name}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  garage.status === 'active' 
                                    ? 'bg-success-100 text-success-800' 
                                    : 'bg-error-100 text-error-800'
                                }`}>
                                  {garage.status.charAt(0).toUpperCase() + garage.status.slice(1)}
                                </span>
                              </div>
                              <div className="text-xs text-secondary-500 mt-1">
                                Created: {formatDate(garage.created_at)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-secondary-500 text-sm">No garages found.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTab; 